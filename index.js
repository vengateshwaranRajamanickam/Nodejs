
import  express  from "express";
import  {MongoClient} from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json())  //interceptor convert body to json
const MONGO_URL = process.env.MONGO_URL;

async function createConnection(){
    const data=new MongoClient(MONGO_URL);
    await data.connect();
    return data; 
}
const client= await createConnection();

//1 create room
app.post('/create_room',async(req,res)=>{  
    try{
        const room=req.query.type;
    console.log(room)
    const insidebody=req.body; 
    let product;
    if(room=="Basic"){
    product=await client.db("Hotel").collection("BasicRoom").insertMany(insidebody)
    res.send(product)
    }
    else if(room=="Deluxe"){
    product=await client.db("Hotel").collection("DeluxeRoom").insertMany(insidebody)
    }
    else{
    product=await client.db("Hotel").collection("Special").insertMany(insidebody)
    }
    res.send(product)
}
catch(err){
    console.log(err.message)
}
}) 
//2 Booking a room
app.post('/book_room',async(req,res)=>{  
    try{
    const roomtype=req.query.type;
    const insidebody=req.body; 
    let booking_name=insidebody[0].Date;
    let booking_time=insidebody[0].Time;
    const product=await client.db("Hotel").collection(`${roomtype}`).insertMany(
        insidebody,
        {$filter:{$and:[
            {Customer_Name: { $ne: booking_name},
           Start_time: { $ne: booking_time }}
        ]}
      })
    await client.db("Hotel").collection("Booking_detail").insertMany(insidebody)
    res.send(product)
    } 
    catch{
        res.send("Room is booked on particular date & time")
    }
})
//3 room with booked detail
app.get('/',async(req,res)=>{ 
    try{
    let product1 = await client.db("Hotel").collection("BasicRoom").find({}).toArray()    
    let product2=await client.db("Hotel").collection("DeluxeRoom").find().toArray()
    res.json({ Basic: product1, Deluxe: product2 });
    }
    catch{
        console.log("No room Booked")
    }
})
//4 customer with booked detail
app.get('/customer_booked', async (req, res) => {
    try {
        let product1 = await client.db("Hotel").collection("BasicRoom")
            .aggregate([
                {
                    $lookup:
                        { from: "CustomerDetail", localField: 'Customer_Name', foreignField: 'Customer_Name', as: 'result' }
                }
            ]).toArray();
            let product2 = await client.db("Hotel").collection("DeluxeRoom")
            .aggregate([
                {
                    $lookup:
                        { from: "CustomerDetail", localField: 'Customer_Name', foreignField: 'Customer_Name', as: 'result' }
                }
            ]).toArray();
            res.status(200).send({ Basic: product1, Deluxe: product2 });
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



