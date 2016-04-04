var pkt_util = require("../pkt_util");

//Also known as MAC address
function EthernetAddr(raw_packet, offset) {
	this.addr = new Array(6);
	this.addr[0] = raw_packet[offset];
	this.addr[1] = raw_packet[offset + 1];
	this.addr[2] = raw_packet[offset + 2];
	this.addr[3] = raw_packet[offset + 3];
	this.addr[4] = raw_packet[offset + 4];
	this.addr[5] = raw_packet[offset + 5];
}

EthernetAddr.prototype.toString = function toString() {
	return pkt_util.int8_to_hex[this.addr[0]] + ":" +
		pkt_util.int8_to_hex[this.addr[1]] + ":" +
		pkt_util.int8_to_hex[this.addr[2]] + ":" +
		pkt_util.int8_to_hex[this.addr[3]] + ":" +
		pkt_util.int8_to_hex[this.addr[4]] + ":" +
		pkt_util.int8_to_hex[this.addr[5]];
};

module.exports = EthernetAddr;
