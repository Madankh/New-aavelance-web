const mongoose = require("mongoose");

const liveSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
	streamKey: {
		type: String,
		required: true,
		select: false,
	},
	seller: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "Seller",
	},
	thumbnail: {
		type: String,
		required: [true, "Thumbnail is required"],
	},
	description: {
		type: String,
		required: [true, "Description is required"],
	},
	m3u8File: String,
	status: {
		type: String,
		default: "Ready for streaming",
		enum: ["Ready for streaming", "Streaming", "Ended"],
	},
});

const Live = mongoose.model("Live", liveSchema);

module.exports = Live;
