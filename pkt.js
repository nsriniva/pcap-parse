var fs = require( 'fs' )
var ws = require( 'websocket-stream' )

var pkt_count = 0
var pcapp = require('./pcap-parser')
var parser

if ( process.argv.length >= 3 ) {

    var readStream

    if ( process.argv.length == 3 ) {
	readStream = fs.createReadStream(process.argv[2])
    } else {
	var stream = ws('ws://localhost:9000')

	stream.write(process.argv[2])
	readStream = stream
    }
    parser = pcapp.parse(readStream)
    
    parser.on( 'globalHeader', function(globalHeader) {
	console.log( JSON.stringify(globalHeader, gReplacer, ' '))
    } )
    
    parser.on( 'packet', function(packet) {
	pkt_count++
	console.log( 'PACKET[' + pkt_count + '] = {\n' + JSON.stringify(packet.header, null, ' ') + '\n' + packet.data.toString() + '\n}') 
    } )
}
else {
    console.log('Need pcap file name!' )
    process.exit(1)
} 



function linkString( linkType ) {

    switch ( linkType ) {

    case parser.LINKTYPE_NULL:
	return "LINKTYPE_NULL"
    case parser.LINKTYPE_ETHERNET:
	return "LINKTYPE_ETHERNET"
    case parser.LINKTYPE_RAW:
	return "LINKTYPE_RAW"
    case parser.LINKTYPE_LINUX_SLL:
	return "LINKTYPE_SLL"
    case parser.LINKTYPE_IEEE802_11_RADIOTAP:
	return "LINKTYPE_IEEE802_11_RADIOTAP"
    default:
	return linkType
    }
}

function gReplacer(key, value) {

    if ( key == "magicNumber" ) {
	return value.toString(16)
    }
    if ( key == "linkLayerType" ) {
	return linkString( value )
    }

    return value;
}


