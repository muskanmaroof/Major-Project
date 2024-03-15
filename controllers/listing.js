const Listing = require("../models/listing");


/// ==== Index route ==== ///
module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({}).populate("image");
    res.render("listings/index.ejs",{allListings});
};

/// ===== New Route ==== ///
module.exports.showNewForm = (req,res)=>{
    res.render("listings/new.ejs").populate("image");
};

///==== Show Route ==== ///
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner").populate("image");
    if(!listing){
        req.flash("error","Listing does not existed");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

/// ==== Create Route === ///
module.exports.createListing = async (req,res,next)=>{
    //let {title,description,location,price,country} = req.params;
    // let listing = req.body.listing;
        let url = req.file.path;
        let filename = req.file.filename;
        
        const newListing = new Listing(req.body.listing); 
        newListing.owner = req.user._id; // this user is from default property of passport;
        newListing.image = {url,filename};       
        await newListing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
        // console.log(result); 
};

/// ==== Edit Route ==== ///
module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;

    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not existed");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" ,"/upload/w_250");
    res.render("listings/edit.ejs",{listing ,originalImageUrl});
};

/// ==== Update Route ==== ///
module.exports.updateListing = async (req,res)=>{
   
    let {id} = req.params;
    let newListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url,filename};
        newListing.save();
    }
    
    req.flash("success"," Listing Updated");
    res.redirect(`/listings/${id}`);
};

/// ==== Delete Route === //
module.exports.destroyListing =  async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); 
    console.log(deletedListing);
    req.flash("success"," Listing Deleted");
    res.redirect("/listings");
};
