const sharp = require("sharp");
const crypto = require("crypto");
const Path = require("path");
const Live = require("../models/Live");
const AppError = require("../utilities/AppError");
const CatchAsync = require("../utilities/CatchAsync");
const filterObject = require("../utilities/filterObject");
const { ownsChannel } = require("./channel");
const router = require("./mainAdmin");
const { sellerverifyToken } = require("./SellerverifyToken");

router.get("/:id" , sellerverifyToken ,async (req , res)=>{

	const live = await Live.findById(req.params.id).select("+streamKey");

	if (!live) {
		return res.status.json("Live not found");
	}

	if (live.status === "Ended") {
		return res.status.json("Live is over");
	}

	if (!(req.seller(req.seller, live.channel))) {
		// who does not own this channel, should not see the streamkey
		live.streamKey = undefined;
	}

	res.status(200).json({
		status: "success",
		data: {
			live,
		},
	});
});
router.get("/publish" , sellerverifyToken ,async (req , res)=>{
	// this route is only accessable to nginx
	// it checks if there is any live associated with that streamkey
	const streamKey = req.body.name;

	const live = await Live.findOne({ streamKey });
	if (!live) {
		return res.status.json("Stream not found");
	}

	if (live.status === "Ended") {
		return res.status.json("Stream is ended");
	}

	// in this process, the client streamer in redirected to a new route of streaming
	// which is created using the name of the stream.
	// because if we don't the stream key is used for the files assocuated with this streaming
	// and when retrieving those files (segments and m3u8), streamkey is leaked
	// so we redirect to a new route using the name which is public
	// and the files are saved using the name
	const m3u8Filename = live.name.split(" ").join("_");
	live.m3u8File = `${m3u8Filename}.m3u8`;
	live.status = "Streaming";
	await live.save();

	// redirecting happens using this header
	res.setHeader("Location", m3u8Filename);
	res.status(301).end();
});

router.post("/createLive" , sellerverifyToken ,async (req , res)=>{
	if (!ownsChannel(req.user, req.body.channel)) {
		return res.status.json("You don't own this channel");
	}

	if (!req.file) {
		return res.status.json("Thumbnail is required");
	}

	req.body = filterObject(req.body, "name", "description", "channel");

	// streamkey is randomly created for every live
	req.body.streamKey = crypto.randomBytes(10).toString("hex");

	const thumbnailFilename = `live-${req.seller.id}-${req.body.channel}-thumbnail.jpg`;

	await sharp(req.file.buffer)
		.resize(640, 360) // 16:9 aspect ratio
		.toFile(Path.join(__dirname, `../storage/thumbnails/${thumbnailFilename}`));

	req.body.thumbnail = thumbnailFilename;

	const live = await Live.create(req.body);

	res.status(201).json({
		status: "success",
		message: "Live created successfully",
		data: {
			live,
		},
	});
});
router.get("/publishDone" , sellerverifyToken ,async (req , res)=>{
	const streamKey = req.body.name;

	// when an streamer ends, this route is called by nginx
	// we set the document to ended state
	const live = await Live.findOne({ streamKey });
	if (!live) {
		return res.status.json("Stream not found");
	}

	live.status = "Ended";
	live.m3u8File = undefined;
	await live.save();

	res.status(200).end();
});



// TODO: delete stream files after stream ended
// TODO: Comments on live
