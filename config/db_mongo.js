const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log('Database connection is ready...');
}).catch((err)=>{
    console.log(err);
});

module.exports = mongoose;
