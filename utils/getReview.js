//models
import {Listing as listing} from '../DB_model/listing.js' ;

// get reviews
async function getReview(id){
    const listed = await listing.findById(id).populate('reviews');
     if (!listed) return { listed: null, listedReviews: [] };
    // console.log(lisingReviews);
    return {listed, listedReviews: listed.reviews};
}

export default getReview;