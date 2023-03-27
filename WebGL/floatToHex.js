
    //https://stackoverflow.com/questions/33317784/how-to-change-four-hexadecimal-number-to-float-in-js.html
    //https://www.h-schmidt.net/FloatConverter/IEEE754.html


/*

//new Float32Array(new Uint8ClampedArray([0xcd,0xcc,0xcc,0xbe]).buffer)[0] = -0.4


IEEE-754 floating point numbers :
1O111111OOOOOOOOOOOOOOOOOOOOOOOO = -0.5
=
10111111 00000000 00000000 00000000
=
0b10111111 0b0 0b0 0b0
=
(0b10111111).toString(16) 0.toString(16) 0.toString(16) 0.toString(16)
=
0xbf 0x0 0x0 0x0 0x0
=
BF 00 00 00 00




//new Float32Array(new Uint8ClampedArray([0x0,0x0,0x0,0xbf]).buffer)[0]=-0.5

*/

    function floatToHex(x) {
      return Array.from(
        new Uint8ClampedArray(       // Represents the four bytes…
          new Float32Array([x])  // …of this number
            .buffer
        )
      )
        .map(
          function(a){
            return a.toString(16);
          }
        );
    }

    new Float32Array(
      new Uint8ClampedArray(
        ["e1", "7a", "cc", "41"].map(function(a){
          return parseInt(a, 16);}
        )
      ).buffer
    );


/*

const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const toHexString = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

console.log(toHexString(Uint8Array.from([0, 1, 2, 42, 100, 101, 102, 255])));
console.log(fromHexString('0001022a646566ff'));



const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

  Uint8Array.from ?
.   The Uint8Array.from() method is used to create a new Uint8Array from an array-like or iterable object.
      array_like or iterable object ?
        * Iterable objects are a generalization of arrays.
          That’s a concept that allows us to make any object useable in a for..of loop.
          For instance, strings are also iterable
          https://javascript.info/iterable

          Array.from() :
          Array.from("philippe") ==> ["p","h","i",...]
          Array.from("abc",x=>x+"!")  ===> ["a!","b!","c!"]
          Array.from("ee",(x,index)=>x+index) ===>  [ "e0", "e1" ]


*/

