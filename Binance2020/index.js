//index.js 2020
const api = require('./api');
const Binance = require('node-binance-api');
const binance = new Binance();
const connStr = "Server=localhost;Database=master;trustServerCertificate=true;User Id=sa;Password=Janeiro@2023;";
const sql = require("mssql");
var timestamp = new Date().getTime();
var PriceBTC  = '0'
var PriceETH  = '0'
var PriceETHBTC  = '0'
var StarTP = 1608560739999
var xCOIN= 'BTCBUSD'
var xTIMEOPEN=1608560739999
var xOPEN='0'
var xHIGH='0'
var xLOW='0'
var xCLOSE='0'
var xVOLUME='0'
var xTIMECLOSE=1608560739999
var xASSETVOLUME='0'
var xTRADES=0
var xBUYBASEVOLUME='0'
var xBUYASSETVOLUME='0'

console.log('Iniciando monitoramento!');

setInterval(async () => {
   
sql.connect(connStr)
   .then(conn =>  create(conn))
   .catch(err => console.log("erro! " + err));
  
    
}, process.env.CRAWLER_INTERVAL);


   function create(conn){

      const table = new sql.Table('BTCUSDT');
      table.create = true;
      table.columns.add('COIN', sql.NVarChar(50), {nullable: false});
      table.columns.add('TIMEOPEN', sql.DateTime);
      table.columns.add('OPEN', sql.NVarChar(50), {nullable: false});
      table.columns.add('HIGH', sql.NVarChar(50), {nullable: false});
      table.columns.add('LOW', sql.NVarChar(50), {nullable: false});
      table.columns.add('CLOSE', sql.NVarChar(50), {nullable: false});
      table.columns.add('VOLUME', sql.NVarChar(50), {nullable: false});
      table.columns.add('TIMECLOSE', sql.DateTime);
      table.columns.add('ASSETVOLUME', sql.NVarChar(50), {nullable: false});
      table.columns.add('TRADES', sql.Numeric(38), {nullable: false});
      table.columns.add('BUYBASEVOLUME', sql.NVarChar(50), {nullable: false});
      table.columns.add('BUYASSETVOLUME', sql.NVarChar(50), {nullable: false});
    
          xCOIN='BTCUSDT'
  // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
binance.candlesticks(xCOIN, "1m", (error, ticks, symbol) => {
  //console.info("candlesticks()", ticks);
  let last_tick = ticks[ticks.length - 1];
  //let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
  if(Array.isArray(last_tick)) {
   let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
   // código que utiliza as variáveis desestruturadas
 } else {
   console.error("last_tick não é um array!");
 }
  //console.info(symbol+" last close: "+close);
  //console.info(closeTime);
  StarTP = closeTime;
 
xTIMEOPEN=time
xOPEN=open
xHIGH=high
xLOW=low
xCLOSE=close
xVOLUME=volume
xTIMECLOSE=closeTime
xASSETVOLUME=assetVolume
xTRADES= trades
xBUYBASEVOLUME=buyBaseVolume
xBUYASSETVOLUME=  buyAssetVolume

}, {limit: 1, startTime: StarTP });
 
table.rows.add(  xCOIN,xTIMEOPEN, xOPEN, xHIGH, xLOW, xCLOSE, xVOLUME, xTIMECLOSE, xASSETVOLUME, xTRADES, xBUYBASEVOLUME, xBUYASSETVOLUME  );
  

      
      const request = new sql.Request()
      request.bulk(table)
             .then(result =>  console.log(xTIMECLOSE + ' ok '))
             .catch(err => console.log('erro no bulk. ' + err));
}
 
   function createTable(conn){

      const table = new sql.Table('BTCBUSD');
      table.create = true;
      table.columns.add('TIME', sql.DateTime);
      table.columns.add('PRICE', sql.NVarChar(50), {nullable: false});
      table.columns.add('ATIVO', sql.NVarChar(50), {nullable: false});
    timestamp = new Date().getTime();
    binance.prices('BTCBUSD', (error, ticker) => {
      PriceBTC = ticker['BTCBUSD'];  // note ticker[coin]
     });
      console.log(PriceBTC);
      table.rows.add( timestamp , PriceBTC,'BTCBUSD'  );
     
      const request = new sql.Request()
      request.bulk(table)
             .then(result => ETHcreateTable(conn) )
             .catch(err => console.log('erro no bulk. ' + err));
}

   function ETHcreateTable(conn){

      const table = new sql.Table('ETHBUSD');
      console.log('funcionou BTCUSD')
      table.create = true;
      table.columns.add('TIME', sql.DateTime);
      table.columns.add('PRICE', sql.NVarChar(50), {nullable: false});
      table.columns.add('ATIVO', sql.NVarChar(50), {nullable: false});
    timestamp = new Date().getTime();
    binance.prices('ETHBUSD', (error, ticker) => {
      PriceETH = ticker['ETHBUSD'];  // note ticker[coin]
     });
      console.log(PriceETH);
      table.rows.add( timestamp , PriceETH ,'ETHBUSD' );
     
      const request = new sql.Request()
      request.bulk(table)
             .then(result => BTCcreateTable(conn))
             .catch(err => console.log('erro no bulk. ' + err));
}

   function BTCcreateTable(conn){

      const table = new sql.Table('ETHBTC');
      console.log('funcionou ETHUSD')
      table.create = true;
      table.columns.add('TIME', sql.DateTime);
      table.columns.add('PRICE', sql.NVarChar(50), {nullable: false});
      table.columns.add('ATIVO', sql.NVarChar(50), {nullable: false});
    timestamp = new Date().getTime();
    binance.prices('ETHBTC', (error, ticker) => {
      PriceETHBTC = ticker['ETHBTC'];  // note ticker[coin]
     });
      console.log(PriceETHBTC);
      table.rows.add( timestamp , PriceETHBTC,'ETHBTC'  );
     
      const request = new sql.Request()
      request.bulk(table)
             .then(result => console.log('funcionou ETHBTC'))
             .catch(err => console.log('erro no bulk. ' + err));
}
