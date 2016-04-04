var util = require('util')
var events = require('events/')
var process = require('process/')

var Buffer = require('buffer/').Buffer
var EthernetPacket = require("./decode/ethernet_packet");
var NullPacket = require("./decode/null_packet");
var Ipv4 = require("./decode/ipv4");
var RadioPacket = require("./decode/ieee802.11/radio_packet");
var SLLPacket = require("./decode/sll_packet");

var GLOBAL_HEADER_LENGTH = 24; //bytes
var PACKET_HEADER_LENGTH = 16; //bytes

function onError(err) {
  this.emit('error', err);
}

function onEnd() {
  this.emit('end');
}

function onData(data) {
  if (this.errored) {
    return;
  }

  updateBuffer.call(this, data);
  while (this.state.call(this)) {}
}

function updateBuffer(data) {
  if (data === null || data === undefined) {
    return;
  }

  if (this.buffer === null) {
    this.buffer = data;
  } else {
    var extendedBuffer = new Buffer(this.buffer.length + data.length);
    this.buffer.copy(extendedBuffer);
    data.copy(extendedBuffer, this.buffer.length);
    this.buffer = extendedBuffer;
  }
}

function parseGlobalHeader() {
  var buffer = this.buffer;

  if (buffer.length >= GLOBAL_HEADER_LENGTH) {
    var msg;
    var magicNumber = buffer.toString('hex', 0, 4);

    // determine pcap endianness
    if (magicNumber == "a1b2c3d4") {
      this.endianness = "BE";
    } else if (magicNumber == "d4c3b2a1") {
      this.endianness = "LE";
    } else {
      this.errored = true;
      this.stream.pause();
      msg = util.format('unknown magic number: %s', magicNumber);
      this.emit('error', new Error(msg));
      onEnd.call(this);
      return false;
    }

      this.readUInt32 = 'readUInt32' + this.endianness
      this.readInt32 = 'readInt32' + this.endianness
      this.readUInt16 = 'readUInt16' + this.endianness
      
    var header = {
      magicNumber: buffer[this.readUInt32](0, true),
      majorVersion: buffer[this.readUInt16](4, true),
      minorVersion: buffer[this.readUInt16](6, true),
      gmtOffset: buffer[this.readInt32](8, true),
      timestampAccuracy: buffer[this.readUInt32](12, true),
      snapshotLength: buffer[this.readUInt32](16, true),
      linkLayerType: buffer[this.readUInt32](20, true)
    };

    if (header.majorVersion != 2 && header.minorVersion != 4) {
      this.errored = true;
      this.stream.pause();
      msg = util.format('unsupported version %d.%d. pcap-parser only parses libpcap file format 2.4', header.majorVersion, header.minorVersion);
      this.emit('error', new Error(msg));
      onEnd.call(this);
    } else {
	this.emit('globalHeader', header);
	this.globalHeader = header
      this.buffer = buffer.slice(GLOBAL_HEADER_LENGTH);
      this.state = parsePacketHeader;
      return true;
    }
  }

  return false;
}

function parsePacketHeader() {
  var buffer = this.buffer;

  if (buffer.length >= PACKET_HEADER_LENGTH) {
    var header = {
      timestampSeconds: buffer[this.readUInt32](0, true),
      timestampMicroseconds: buffer[this.readUInt32](4, true),
      capturedLength: buffer[this.readUInt32](8, true),
      originalLength: buffer[this.readUInt32](12, true)
    };

    this.currentPacketHeader = header;
    this.emit('packetHeader', header);
    this.buffer = buffer.slice(PACKET_HEADER_LENGTH);
    this.state = parsePacketBody;
    return true;
  }

  return false;
}

function parsePacketBody() {
  var buffer = this.buffer;

  if (buffer.length >= this.currentPacketHeader.capturedLength) {
      var data =  buffer.slice(0, this.currentPacketHeader.capturedLength)

      var payload = parsePacket.call(this, data)
    this.emit('packetData', payload);
    this.emit('packet', {
      header: this.currentPacketHeader,
      data: payload
    });

    this.buffer = buffer.slice(this.currentPacketHeader.capturedLength);
    this.state = parsePacketHeader;
    return true;
  }

  return false;
}

function parsePacket(buf) {

    switch (this.globalHeader.linkLayerType) {
    case this.LINKTYPE_ETHERNET:
        return new EthernetPacket().decode(buf, 0);
    case this.LINKTYPE_NULL:
        return new NullPacket().decode(buf, 0);
    case this.LINKTYPE_RAW:
        return new Ipv4().decode(buf, 0);
    case this.LINKTYPE_IEEE802_11_RADIOTAP:
        return new RadioPacket().decode(buf, 0);
    case this.LINKTYPE_LINUX_SLL:
        return new SLLPacket().decode(buf, 0);
    default:
        console.log("node_pcap: PcapPacket.decode - Don't yet know how to decode link type " + this.link_type);
    }
   
}

function Parser(input) {

    // assume a ReadableStream
    this.stream = input;

    this.stream.pause();
    this.LINKTYPE_NULL = 0
    this.LINKTYPE_ETHERNET = 1
    this.LINKTYPE_RAW = 101
    this.LINKTYPE_LINUX_SLL = 113
    this.LINKTYPE_IEEE802_11_RADIOTAP = 127
    
    this.stream.on('data', onData.bind(this));
  this.stream.on('error', onError.bind(this));
    this.stream.on('end', onEnd.bind(this));



  this.buffer = null;
  this.state = parseGlobalHeader;
  this.endianness = null;

  process.nextTick(this.stream.resume.bind(this.stream));
}
util.inherits(Parser, events.EventEmitter);

exports.parse = function (input) {
  return new Parser(input);
};
