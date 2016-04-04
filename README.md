# pcap-parse
Browserifiable javascript library for parsing pcap encoded streams.

PCAP parser library
----------------
Dependencies : `buffer`, `events` and `process` modules - installable 
via `npm install <name>`

`pcap-parser.js` -> exports a Parser object which takes a readable stream 
as input and emits `globalHeader` and `packet` events(among others but 
these are the most interesting) . 

This is the file you'll want to browserify.

Test code
--------
Dependencies : `websocket-stream`

`pkt-server.js` -> websocket server listening at port 9000 - waits for a 
file name and on receipt opens and streams the data from the file back 
to the client.

Execution : `node ./pkt-server.js &`

`pkt.js` -> The main test code which will create a readable stream by 
either opening the pcap file directly or using `websocket-stream` to 
communicate with the server

Execution : `node ./pkt.js <path to pcap file> [ ws ]` - if the `ws` 
keyword is present, `pkt.js` uses a websocket to read the pcap data from 
the server, else it opens the file directly.

Useful links
----------
`pcap-parser.js` was created by using the

`node-pcap` : https://github.com/mranney/node_pcap

and

`node-pcap-parser` : https://github.com/kunklejr/node-pcap-parser

modules

`browserify` -> http://browserify.org/

`buffer`        -> https://github.com/feross/buffer

`events`       -> https://github.com/Gozala/events

`process`     -> https://github.com/defunctzombie/node-process

`websocket-stream` -> https://github.com/maxogden/websocket-stream


Sample Decoder Output
---------------------
```
{
 "magicNumber": "a1b2c3d4",
 "majorVersion": 2,
 "minorVersion": 4,
 "gmtOffset": 0,
 "timestampAccuracy": 0,
 "snapshotLength": 262144,
 "linkLayerType": "LINKTYPE_ETHERNET"
}
PACKET[1] = {
{
 "timestampSeconds": 1433187077,
 "timestampMicroseconds": 266331,
 "capturedLength": 60,
 "originalLength": 60
}
52:54:00:12:35:02 -> 08:00:27:75:ac:ec IPv4 10.0.2.2 -> 10.0.2.15 TCP 59385->58472 seq 1535040002 ack 3920938139 flags [af] win 65535 csum 59278 [.] len 0
}
PACKET[2] = {
{
 "timestampSeconds": 1433187078,
 "timestampMicroseconds": 768135,
 "capturedLength": 60,
 "originalLength": 60
}
52:54:00:12:35:02 -> 08:00:27:75:ac:ec IPv4 10.0.2.2 -> 10.0.2.15 TCP 19336->33284 seq 1534720002 ack 2551500226 flags [af] win 65535 csum 4323 [.] len 0
}
PACKET[3] = {
{
 "timestampSeconds": 1433187081,
 "timestampMicroseconds": 298010,
 "capturedLength": 86,
 "originalLength": 86
}
08:00:27:75:ac:ec -> 52:54:00:12:35:02 IPv4 10.0.2.15 -> 171.70.168.183 flags [d] UDP UDP 42025->53 len 52 DNS { isResponse:false opcode:0 isAuthority:false isTruncated:false isRecursionDesired:false isRecursionAvailible:false z:0 responseCode:0 }
  question:fedora.bhs.mirrors.ovh.net A IN
}
PACKET[4] = {
{
 "timestampSeconds": 1433187081,
 "timestampMicroseconds": 298192,
 "capturedLength": 86,
 "originalLength": 86
}
08:00:27:75:ac:ec -> 52:54:00:12:35:02 IPv4 10.0.2.15 -> 171.70.168.183 flags [d] UDP UDP 42025->53 len 52 DNS { isResponse:false opcode:0 isAuthority:false isTruncated:false isRecursionDesired:false isRecursionAvailible:false z:0 responseCode:0 }
  question:fedora.bhs.mirrors.ovh.net AAAA IN
}
PACKET[5] = {
{
 "timestampSeconds": 1433187081,
 "timestampMicroseconds": 313189,
 "capturedLength": 210,
 "originalLength": 210
}
52:54:00:12:35:02 -> 08:00:27:75:ac:ec IPv4 171.70.168.183 -> 10.0.2.15 UDP UDP 53->42025 len 176 DNS { isResponse:false opcode:0 isAuthority:false isTruncated:false isRecursionDesired:false isRecursionAvailible:false z:0 responseCode:0 }
  question:fedora.bhs.mirrors.ovh.net A IN
  answer:fedora.bhs.mirrors.ovh.net CNAME IN 120 null, mir1.ovh.ca A IN 10 142.4.218.29
  authority:ovh.ca NS IN 17432 dns19.ovh.net, ovh.ca NS IN 17432 ns19.ovh.net
  additional:dns19.ovh.net A IN 32192 213.251.188.139, dns19.ovh.net AAAA IN 32192 null
}
PACKET[6] = {
{
 "timestampSeconds": 1433187081,
 "timestampMicroseconds": 313585,
 "capturedLength": 222,
 "originalLength": 222
}
52:54:00:12:35:02 -> 08:00:27:75:ac:ec IPv4 171.70.168.183 -> 10.0.2.15 UDP UDP 53->42025 len 188 DNS { isResponse:false opcode:0 isAuthority:false isTruncated:false isRecursionDesired:false isRecursionAvailible:false z:0 responseCode:0 }
  question:fedora.bhs.mirrors.ovh.net AAAA IN
  answer:fedora.bhs.mirrors.ovh.net CNAME IN 120 null, mir1.ovh.ca AAAA IN 10 null
  authority:ovh.ca NS IN 17432 ns19.ovh.net, ovh.ca NS IN 17432 dns19.ovh.net
  additional:dns19.ovh.net A IN 32192 213.251.188.139, dns19.ovh.net AAAA IN 32192 null
}
PACKET[7] = {
{
 "timestampSeconds": 1433187081,
 "timestampMicroseconds": 315737,
 "capturedLength": 74,
 "originalLength": 74
}
08:00:27:75:ac:ec -> 52:54:00:12:35:02 IPv4 10.0.2.15 -> 142.4.218.29 flags [d] TCP 42904->80 seq 3819748619 ack 0 flags [s] win 29200 csum 29791 [mss:1460 scale:7(128) sack_ok] len 0
}
PACKET[8] = {
{
 "timestampSeconds": 1433187081,
 "timestampMicroseconds": 317365,
 "capturedLength": 60,
 "originalLength": 60
}
52:54:00:12:35:02 -> 08:00:27:75:ac:ec IPv4 142.4.218.29 -> 10.0.2.15 TCP 80->42904 seq 1573248001 ack 3819748620 flags [as] win 65535 csum 41340 [mss:1460] len 0
}
PACKET[9] = {
{
 "timestampSeconds": 1433187081,
 "timestampMicroseconds": 317431,
 "capturedLength": 54,
 "originalLength": 54
}
08:00:27:75:ac:ec -> 52:54:00:12:35:02 IPv4 10.0.2.15 -> 142.4.218.29 flags [d] TCP 42904->80 seq 3819748620 ack 1573248002 flags [a] win 29200 csum 29771 [.] len 0
}
PACKET[10] = {
{
 "timestampSeconds": 1433187081,
 "timestampMicroseconds": 317594,
 "capturedLength": 220,
 "originalLength": 220
}
08:00:27:75:ac:ec -> 52:54:00:12:35:02 IPv4 10.0.2.15 -> 142.4.218.29 flags [d] TCP 42904->80 seq 3819748620 ack 1573248002 flags [ap] win 29200 csum 29937 [.] len 166
}
PACKET[11] = {
{
 "timestampSeconds": 1433187081,
 "timestampMicroseconds": 317776,
 "capturedLength": 60,
 "originalLength": 60
}
52:54:00:12:35:02 -> 08:00:27:75:ac:ec IPv4 142.4.218.29 -> 10.0.2.15 TCP 80->42904 seq 1573248002 ack 3819748786 flags [a] win 65535 csum 47251 [.] len 0
}
```
