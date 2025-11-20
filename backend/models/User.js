const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Counter = require("./Counter");

const userSchema = new mongoose.Schema({
    
    userId:{
        type: String,
        unique: true,
    },

    name:{
        type: String,
        required: true,
        trim: true,
    },

    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
    },

    role:{
        type: String,
        enum: ["Lead", "Chairperson", "Faculty Coordinator", "TPO", "Vice Principal", "Principal"],
    },

    committee:{
        type: String,
        enum: ["GDG Student Club", "Synapse Club", "ACM Student Chapter", "none"],
    },

    sign: {
        type: String,
        default: null,
    }
},
{timestamps: true}

);

userSchema.pre("save", async function (next){

    if(this.isNew){
        const counter = await Counter.findOneAndUpdate(
            {name: "userId"},
            { $inc: {value:1}},
            { new:true, upsert: true}
        );

        this.userId = "U"+counter.value.toString().padStart(4, "0");
    }
    if (this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);