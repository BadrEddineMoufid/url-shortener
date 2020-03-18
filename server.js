const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

//setting view engine
app.set('view engine','ejs')

//configuring express to user url parameters
app.use(express.urlencoded({extended: false}))

//connecting to DB cluster
mongoose.connect('mongodb+srv://admin:<password>@cluster0-4q93r.mongodb.net/test?retryWrites=true&w=majority',{
	useNewUrlParser:true,
	useUnifiedTopology: true
})

//root route add new url and see url info
app.get('/', async(req, res)=>{
	const shortUrls = await ShortUrl.find()

    res.render('index',{shortUrls: shortUrls})
})

//post route --create shorturl and add it to DB
app.post('/shortUrls', async (req, res)=>{
	await ShortUrl.create({full: req.body.fullUrl});
	res.redirect('/');
})


//redirecting to fullUrl from shortUrl 
app.get('/:shortUrl', async (req, res)=>{

	const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })

	if(shortUrl == null)return res.send("not found")

	//just logging the return object from finOne() function
	console.log(shortUrl);

	//incrementing nmbr of clicks
	shortUrl.clicks++;

	//updating db with new value
	shortUrl.save();

	res.redirect(shortUrl.full)
})




app.listen(process.env.PORT || 5000, ()=> console.log("server up and running on port 5000"))