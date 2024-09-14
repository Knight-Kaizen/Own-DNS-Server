const dgram = require("dgram");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
//
const udpSocket = dgram.createSocket("udp4");
const defaultHeader = {
    ID: 1234,
    qr: 1,
    opcode: 0,
    aa: 0,
    tc: 0,
    rd: 0,
    ra: 0,
    z: 0,
    rcode: 0,
    qdcount: 0,
    ancount: 0,
    nscount: 0,
    arcount: 0,
  };

  /**
   * A DNS header is 12 bytes (96 bits) and consists of the following fields:

	1.	ID (16 bits): A 16-bit identifier assigned by the client.
	2.	Flags (16 bits): Contains several fields:
	•	qr (1 bit): Query/Response flag.
	•	opcode (4 bits): Operation code.
	•	aa (1 bit): Authoritative Answer flag.
	•	tc (1 bit): Truncation flag.
	•	rd (1 bit): Recursion Desired flag.
	•	ra (1 bit): Recursion Available flag.
	•	z (3 bits): Reserved for future use.
	•	rcode (4 bits): Response code.
	3.	qdcount (16 bits): Number of questions.
	4.	ancount (16 bits): Number of answer RRs (resource records).
	5.	nscount (16 bits): Number of authority RRs.
	6.	arcount (16 bits): Number of additional RRs.
   */
  function createResponseHeader(queryBuffer){
    const header = Buffer.alloc(12);
    header.writeUInt16BE(1234, 0); // Pocket Identifier (ID): 1234
    header.writeUInt16BE(0x8000, 2); // Flags: QR=1, OPCODE=0, AA=0, TC=0, RD=0, RA=0, Z=0, RCODE=0
    header.writeUInt16BE(0, 4); // QDCOUNT: 0
    header.writeUInt16BE(0, 6); // ANCOUNT: 0
    header.writeUInt16BE(0, 8); // NSCOUNT: 0
    header.writeUInt16BE(0, 10); // ARCOUNT: 0
    return header;
  }

udpSocket.on("message", (buf, rinfo) => {
  try {
    let response = Buffer.from("");
    response = createResponseHeader(buf);

    udpSocket.send(response, rinfo.port, rinfo.address);
  } catch (e) {
    console.log(`Error receiving data: ${e}`);
  }
});

udpSocket.on("error", (err) => {
  console.log(`Error: ${err}`);
});

udpSocket.on("listening", () => {
  const address = udpSocket.address();
  console.log(`Server listening ${address.address}:${address.port}`);
});

udpSocket.bind(2053, "127.0.0.1");