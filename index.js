
import  express  from "express";
import  {MongoClient} from "mongodb";
const app=express()
const PORT=9000;
app.use(express.json())  //interceptor convert body to json

let message; 
const MONGO_URL='mongodb://0.0.0.0:27017';
async function createConnection(){
    const data=new MongoClient(MONGO_URL);
    await data.connect();
    return data; 
}
const client= await createConnection();
//1 create room
app.post('/create_room',async(req,res)=>{  
    const room=req.query.type;
    const insidebody=req.body; 
    let product;
    if(room=="Basic"){
    product=await client.db("Hotel").collection("Basic").insertMany(insidebody)
    }
    else if(room=="Deluxe"){
    product=await client.db("Hotel").collection("Deluxe").insertMany(insidebody)
    }
    else{
    product=await client.db("Hotel").createCollection("special",insidebody)
    }
    res.send(product)
})
//2 Booking a room
app.post('/book_room',async(req,res)=>{  
    //try{
    const roomtype=req.query.type;
    const insidebody=req.body; 
    let booking_date=req.body.Date;
    let date=new Date();
    // console.log(date,booking_date)
    // if(date.now.toUTCString()===booking_date){
    //     const product=await client.db("Hotel").collection(`${roomtype}`).insertMany({Date:{$ne:date},Start_time:{$ne:booking_date}},insidebody)
    // }
    // else{
        const product=await client.db("Hotel").collection(`${roomtype}`).insertMany(insidebody)
    await client.db("Hotel").collection("Booking_detail").insertMany(insidebody)
    res.send(product)
    //}
    // }
    // catch{
    //     console.log("Room is booked on particular date & time")
    // }
})
//3 room with booked detail
app.get('/',async(req,res)=>{
    try{
    let product1= await client.db("Hotel").collection("BasicRoom").findOne({})    
    let product2=await client.db("Hotel").collection("DeluxeRoom").findOne({})
    res.send({ Basic: product1, Deluxe: product2 });
    }
    catch{
        console.log("No room Booked")
    }
})
//4 customer with booked detail
app.get('/customer_booked', async (req, res) => {
    try {
        let product1 = await client.db("Hotel").collection("CustomerDetail")
            .aggregate([
                {
                    $lookup:
                        { from: "BasicRoom", localField: 'Customer_Name', foreignField: 'Customer_Name', as: 'result' }
                }
            ]).toArray();
            let product2 = await client.db("Hotel").collection("CustomerDetail")
            .aggregate([
                {
                    $lookup:
                        { from: "BasicRoom", localField: 'Customer_Name', foreignField: 'Customer_Name', as: 'result' }
                }
            ]).toArray();
            res.send({ Basic: product1, Deluxe: product2 });
    }
    catch{
        console.log("No customer booked")
    }
    
})
//5 list how many time customer book a room 
app.get('/customer_history', async (req, res) => {
    try {
        let product1 = await client.db("Hotel").collection("CustomerDetail")
            .aggregate([
                {
                    $lookup:
                        { from: "Booking_detail", localField: 'Customer_id', foreignField: 'Customer_id', as: 'result' }
                }
            ]).toArray(); 
        res.send({Customer_history: product1});
    }
    catch{
        console.log("First Time Booking")
    }
    
})
app.listen(PORT,()=>console.log("server started on port",PORT))



