const express = require('express');
const mongoose = require('mongoose');
const businessModel = require('./models/business');
const reviewModel = require('./models/review');
const userModel = require('./models/user');
const app = express();

app.get('/find_businesses', async (request, response) => {
  const businesses = await businessModel.find({
    name: request.query.name,
    city: request.query.city
  });
  // console.log(businesses);
  try {
    response.send(businesses);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/find_rec_businesses', async (request, response) => {
  const businesses = await businessModel.find({
    business_ids: request.query.name,
    city: request.query.city
  });
  // console.log(businesses);
  try {
    response.send(businesses);
  } catch (error) {
    response.status(500).send(error);
  }
});

/*
app.get('/reviews_and_users', async (request, response) => {
  const matchId = request.query.business_id;
  const user_ids = await reviewModel.aggregate([
    { $lookup: {
      from: 'businesses',
      let: { business_id: 'business_id'},
      pipeline = [
        { $match: { business_id: matchId } },
        {
          $lookup: {
            from: 'reviews',
            localField: 'business_id',
            foreignField: 'business_id',
            as: 'review_info'
          }
        },
        { $unwind: '$review_info' },
        { $match: { 'review_info.stars': { $gt: 3 } } },
        {
          $group: {
            _id: null,
            data: {
              $push: '$review_info.user_id'
            }
          }
        },
        {
          $project: {
            _id: 0,
            data: {
              $reduce: {
                input: '$data',
                initialValue: [],
                in: {
                  $concatArrays: ['$$value', ['$$this']]
                }
              }
            }
          }
        }
      ],
      as: 'user_ids'
    },
  }

  ]);

*/

app.get('/find_user_ids', async (request, response) => {
  const matchId = request.query.business_id;
  const user_ids = await businessModel.aggregate([
    { $match: { business_id: matchId } },
    {
      $lookup: {
        from: 'reviews',
        localField: 'business_id',
        foreignField: 'business_id',
        as: 'review_info'
      }
    },
    { $unwind: '$review_info' },
    { $match: { 'review_info.stars': { $gt: 3 } } },
    {
      $group: {
        _id: null,
        data: {
          $push: '$review_info.user_id'
        }
      }
    },
    {
      $project: {
        _id: null,
        data: {
          $reduce: {
            input: '$data',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', ['$$this']]
            }
          }
        }
      }
    }
  ]);

  try {
    // console.log(user_ids);
    response.send(user_ids);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/find_rec_ids', async (request, response) => {
  const users = request.query.users.split(',');
  console.log(users[0]);
  console.log(users[1]);
  console.log('running get_recs');
  const recs = await reviewModel.aggregate([
    {
      $match: {
        $and: [{ user_id: { $in: users } }, { stars: { $gt: 3 } }]
      }
    },
    {
      $group: {
        _id: '$business_id',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
  console.log(recs);
  try {
    response.send(recs);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;

/*
 {
      $group: {
        _id: '$business_id',
        business_id: { $first: '$business_id' },
        name: { $first: '$name' },
        address: { $first: '$address' },
        city: { $first: '$city' },
        state: { $first: '$state' },
        postal_code: { $first: '$postal_code' },
        latitude: { $first: '$latitude' },
        longitude: { $first: '$longitude' },
        stars: { $first: '$stars' },
        review_count: { $first: '$review_count' },
        is_open: { $first: '$is_open' },
        attributes: { $first: '$attributes' },
        categories: { $first: '$categories' },
        hours: { $first: '$hours' },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }



db.businesses.aggregate([{$group: {_id: '$city', count: {$sum : 1}}},{$sort:{count:-1}}])
[
  { _id: 'Philadelphia', count: 14569 },
  { _id: 'Tucson', count: 9250 },
  { _id: 'Tampa', count: 9050 },
  { _id: 'Indianapolis', count: 7540 },
  { _id: 'Nashville', count: 6971 },
  { _id: 'New Orleans', count: 6209 },
  { _id: 'Reno', count: 5935 },
  { _id: 'Edmonton', count: 5054 },
  { _id: 'Saint Louis', count: 4827 },
  { _id: 'Santa Barbara', count: 3829 },
  { _id: 'Boise', count: 2937 },
  { _id: 'Clearwater', count: 2221 },
  { _id: 'Saint Petersburg', count: 1663 }, -- Tampa
  { _id: 'Metairie', count: 1643 }, -- New Orleans
  { _id: 'Sparks', count: 1624 },
  { _id: 'Wilmington', count: 1446 },
  { _id: 'Franklin', count: 1414 },
  { _id: 'St. Louis', count: 1255 },
  { _id: 'St. Petersburg', count: 1185 },
  { _id: 'Meridian', count: 1043 },
  { _id: 'Brandon', count: 1033 },
  { _id: 'Largo', count: 1002 },
  { _id: 'Carmel', count: 967 },
  { _id: 'Cherry Hill', count: 960 },
  { _id: 'West Chester', count: 838 },
  { _id: 'Goleta', count: 798 },
  { _id: 'Brentwood', count: 767 },
  { _id: 'Palm Harbor', count: 665 },
  { _id: 'Greenwood', count: 649 },
  { _id: 'New Port Richey', count: 604 },
  { _id: 'Lutz', count: 591 },
  { _id: 'Riverview', count: 588 },
  { _id: 'Kenner', count: 584 },
  { _id: 'Fishers', count: 570 },
  { _id: 'King of Prussia', count: 560 },
  { _id: 'Wesley Chapel', count: 560 },
  { _id: 'Doylestown', count: 539 },
  { _id: 'Pinellas Park', count: 512 },
  { _id: 'Dunedin', count: 490 },
  { _id: 'Hendersonville', count: 484 }
]


[
  {
    _id: ObjectId("6395078ca7420549bc33917d"),
    review_id: '4nVEJFBDkKscJpDeFZudXQ',
    user_id: 'b1FcNR84FhlP6hJcqzcfRw',
    business_id: 'NxJk32DFY06EbFAvcQJumw',
    stars: 2,
    useful: 1,
    funny: 0,
    cool: 0,
    text: 'Used to be good when it first opened.  Quality has gone downhill.  Ordered the mango salad which came out with apples instead.  (no explanation provided)  Food is mediocre - have been there about 5 or 6 times since it opened but not returning even though it is walking distance from our house.',
    date: '2012-05-28 21:39:00'
  },
  {
    _id: ObjectId("639507a8a7420549bc42992a"),
    review_id: '1L-9_pfMvq_1YlmCq4TmaA',
    user_id: 'b1FcNR84FhlP6hJcqzcfRw',
    business_id: 'agK5cXwnBQozM2M-5kLvzw',
    stars: 5,
    useful: 3,
    funny: 0,
    cool: 2,
    text: 'You must eat here to enjoy the best meatball around!  They are made with love and care and taste out of this world.  Repeat visits a must! Delicious food, friendly fast service, great atmosphere.\n' +
      "The Pasta with Red Gravy (signature dish) was spectacular! Huge serving and you can chose how many meatballs you want. I chose two and had enough for another meal. (ate the left overs for breakfast - waiting for lunch was too long!) The pasta was perfectly cooked. The homemade gravy has a great balance of spices, slightly sweet and tart. Had a bite of my friend's ssandwich - the Lou Parm - also delicious. The fresh apple pie was terrific. The service was excellent - food came out fast. The employees were cheerful and helpful - the chef even came out to see how everything was! She really is an Italian girl from Jersey...The menu has a great variety - looking forward to going back again and again to try the rest of the yummy goodness. Good place for office lunch as the prices are very reasonable and you can get in and out quickly.",
    date: '2010-12-07 14:23:24'
  },
  {
    _id: ObjectId("639507aaa7420549bc439149"),
    review_id: 'yD3NVCrGlrXY11zbNCN-Ow',
    user_id: 'b1FcNR84FhlP6hJcqzcfRw',
    business_id: 'agK5cXwnBQozM2M-5kLvzw',
    stars: 5,
    useful: 0,
    funny: 0,
    cool: 0,
    text: "The red gravy @ Red Gravy continues to be out of this world. The owner has a new sit down restaurant format which works well. We always bring out of town guests to RG and sample multiple dishes - every single one is mouth watering and delicious. You, your belly, and your wallet will be more than satisfied after dining @ Red Gravy.  Please help me try to convince the owners to start shipping the Chef's Red Gravy!",
    date: '2012-05-28 21:17:13'
  },
  {
    _id: ObjectId("639507f2a7420549bc68c698"),
    review_id: 'ADHtZOrvA0ryL4zR_2fICQ',
    user_id: 'b1FcNR84FhlP6hJcqzcfRw',
    business_id: '0DdmKihJ90qKP5TAM3c2yQ',
    stars: 5,
    useful: 0,
    funny: 0,
    cool: 0,
    text: 'Tartine has updated its menu and continues to produce top notch fresh baked breads, muffins and deserts.  The brioche grilled cheese special was as good as a grilled cheese gets.  Lots of healthy, filling, delicious salads too.',
    date: '2012-05-28 21:25:27'
  },
  {
    _id: ObjectId("639507f6a7420549bc6a704d"),
    review_id: 'NCg9cRKg1g4UhCv4EAlA8A',
    user_id: 'b1FcNR84FhlP6hJcqzcfRw',
    business_id: '0DdmKihJ90qKP5TAM3c2yQ',
    stars: 5,
    useful: 1,
    funny: 0,
    cool: 1,
    text: "Awesome fresh baked bread, brioche, bagels, pastries etc everyday.  Menu is terrific - lots of selection.  Pork rillette tartine is delicious. I get the ham and brie baguette (which is broiled enough to melt the cheese) at least once a week.  Salads and sides are awesome and the chocolate mousse the best I've had in a long time.",
    date: '2010-12-09 16:53:59'
  },
  {
    _id: ObjectId("63950808a7420549bc733393"),
    review_id: 'p3sLr6nWII0v-87pR-pgVg',
    user_id: 'b1FcNR84FhlP6hJcqzcfRw',
    business_id: 'Fs4T7lKpXVtD5Pz7jWSJeg',
    stars: 5,
    useful: 0,
    funny: 0,
    cool: 0,
    text: 'Bread, special bread basket & fried Soft shell crab spectacular!  Duck and scallops also great.  Soft shell crab extremely ever so lightly breaded making the crab taste dominate!  Some may think portions are small (for the price) but we thought they were just right.  Had both brunch ($30 for 3 courses) and dinner there.',
    date: '2012-05-28 21:33:57'
  },
  {
    _id: ObjectId("6395083ea7420549bc89516a"),
    review_id: 'sY-muk6jgEaRUaLq0y5cjg',
    user_id: 'b1FcNR84FhlP6hJcqzcfRw',
    business_id: 'M1hsyjJDdQQeNP164FJ1pA',
    stars: 5,
    useful: 0,
    funny: 0,
    cool: 0,
    text: 'Zagat rated (26 or higher?) with great sandwiches and salads',
    date: '2012-05-28 21:20:50'
  },
  {
    _id: ObjectId("6395083fa7420549bc899bde"),
    review_id: 'MwmCpvqGct8P_wyhgBc2UA',
    user_id: 'b1FcNR84FhlP6hJcqzcfRw',
    business_id: 'Kcv0o54px4WFk0ThXjqJPw',
    stars: 4,
    useful: 2,
    funny: 2,
    cool: 2,
    text: 'Great yogurt - very creamy and like ice cream.  Who dat flavor is delicious.  Toppings always fresh, all self serve - charge by the pound.  Friendly staff.',
    date: '2011-08-02 15:57:02'
  }
]
*/
