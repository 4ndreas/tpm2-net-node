var dgram = require('dgram');
var Buffer = require('buffer').Buffer;

function tpm2NetClient(host, port, size) {
	this._host = host;
	this._port = port;
	this._size = size;
	this._socket = dgram.createSocket("udp4");

	this.HEADER = [0x9C]; // 0
	this.TYPE = [0xDA]; // 1	
						// 0xDA = Data frame or
						// 0xC0 = Command or
	this.PACKET_NUMBER = [0]; // 4
	this.NUMBER_OF_PACKETS = [0]; // 4

	this.ENDBYTE = [0x36];

	this.node = this;
}
exports.tpm2NetClient = tpm2NetClient;

exports.createClient = function(host, port) {
	return new tpm2NetClient(host, port);
}

tpm2NetClient.prototype.send = function(data) {
	// Calcualte the length
	var length_upper = Math.floor(data.length / 256);
	var length_lower = data.length % 256;
	
	var packet_number = 0;
	var number_of_packets = 0;

	var data = this.HEADER.concat(this.TYPE).concat([length_upper, length_lower,packet_number,number_of_packets]).concat(data).concat(this.ENDBYTE);
	var buf = Buffer(data);
	this._socket.send(buf, 0, buf.length, this._port, this._host, function(){});
}

tpm2NetClient.prototype.close = function(){
	this._socket.close();
};
