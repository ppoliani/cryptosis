const {create} = require('@most/create');
const CURRENTAGG = '2';
const URL = 'https://streamer.cryptocompare.com/';

const FIELDS = {
    'TYPE'            : 0x0
  , 'MARKET'          : 0x0
  , 'FROMSYMBOL'      : 0x0
  , 'TOSYMBOL'        : 0x0
  , 'FLAGS'           : 0x0
  , 'PRICE'           : 0x1
  , 'BID'             : 0x2
  , 'OFFER'           : 0x4
  , 'LASTUPDATE'      : 0x8
  , 'AVG'             : 0x10
  , 'LASTVOLUME'      : 0x20
  , 'LASTVOLUMETO'    : 0x40
  , 'LASTTRADEID'     : 0x80
  , 'VOLUMEHOUR'      : 0x100
  , 'VOLUMEHOURTO'    : 0x200
  , 'VOLUME24HOUR'    : 0x400
  , 'VOLUME24HOURTO'  : 0x800
  , 'OPENHOUR'        : 0x1000
  , 'HIGHHOUR'        : 0x2000
  , 'LOWHOUR'         : 0x4000
  , 'OPEN24HOUR'      : 0x8000
  , 'HIGH24HOUR'      : 0x10000
  , 'LOW24HOUR'       : 0x20000
  , 'LASTMARKET'      : 0x40000
};

const unpack = value => {
  const valuesArray = value.split("~");
  const valuesArrayLenght = valuesArray.length;
  const mask = valuesArray[valuesArrayLenght-1];
  const maskInt = parseInt(mask,16);
  const unpackedCurrent = {};
  let currentField = 0;

  for(const property in FIELDS) {
      if(FIELDS[property] === 0) {
        unpackedCurrent[property] = valuesArray[currentField];
        currentField++;
      }
      else if(maskInt&FIELDS[property]) {
        if(property === 'LASTMARKET'){
          unpackedCurrent[property] = valuesArray[currentField];
        }
        else{
          unpackedCurrent[property] = parseFloat(valuesArray[currentField]);
        }
        currentField++;
      }
  }

  return unpackedCurrent;
};

const isPriceAvailable = data => data.PRICE != undefined;

const connect = (io, symbol, exchangeName, toSymbol) => {
  const subscription = [`2~${exchangeName}~${symbol}~${toSymbol}`];
  const socket = io.connect(URL, {
    reconnection: true,
    transports: ['websocket']
  });

  socket.emit('SubAdd', {subs:subscription});

  return create((add, end, error) => {
    const handleMessage = message => {
      const messageType = message.substring(0, message.indexOf("~"));

      if (messageType === CURRENTAGG) {
        const unpackedMessage = unpack(message);
        isPriceAvailable(unpackedMessage) && add(unpackedMessage);
      }
    };

    socket.on('m', handleMessage);

    return () => {
      socket.off('m', handleMessage);
      socket.emit('SubRemove', {subs:subscription});
      socket.close();
    }
  });
}

module.exports = {connect};
