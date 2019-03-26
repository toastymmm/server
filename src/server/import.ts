import mongodb = require('mongodb')
import db = require('./db')
import turf = require('@turf/turf')
import Message = db.Message
import Feature = turf.helpers.Feature
import Point = turf.helpers.Point

const users = [
    {
        "_id": new mongodb.ObjectID(),
        "username": "nik",
	 //this hash is for "password"
        "password": "$2a$10$xh3LdNOsFwzCSga4yAJ0oekXaVpMCqCfmZOlCehVX/z0MLFIb2ac2",
    },
    {
        "_id": new mongodb.ObjectID(),
        "username": "nik2",
        "password": "$2a$10$xh3LdNOsFwzCSga4yAJ0oekXaVpMCqCfmZOlCehVX/z0MLFIb2ac2",
    },
    {
        "_id": new mongodb.ObjectID(),
        "username": "nik3",
        "password": "$2a$10$xh3LdNOsFwzCSga4yAJ0oekXaVpMCqCfmZOlCehVX/z0MLFIb2ac2",
    },
    {
        "_id": new mongodb.ObjectID(),
        "username": "nik4",
        "password": "$2a$10$xh3LdNOsFwzCSga4yAJ0oekXaVpMCqCfmZOlCehVX/z0MLFIb2ac2",
    },
    {
        "_id": new mongodb.ObjectID(),
        "username": "nik5",
        "password": "$2a$10$xh3LdNOsFwzCSga4yAJ0oekXaVpMCqCfmZOlCehVX/z0MLFIb2ac2",
    },
]

const messages = [
	{"text":"Today, and every day, I choose to be confident", "category":"Confidence"},
	{"text":"I radiate confidence, certainty and optimism", "category":"Confidence"},
	{"text":"I courageously open and move through every door of opportunity", "category":"Confidence"},
	{"text":"I am in charge of my life", "category":"Confidence"},
	{"text":"I have the power to live my dreams", "category":"Confidence"},
	{"text":"My mind has unlimited power", "category":"Confidence"},
	{"text":"I stand up for what I belief in", "category":"Confidence"},
	{"text":"I act with courage and confidence", "category":"Confidence"},
	{"text":"I believe in myself", "category":"Confidence"},
	{"text":"I am creative and think outside the box", "category":"Entrepreneurship"},
	{"text":"I attract success and prosperity with all of my ideas", "category":"Entrepreneurship"},
	{"text":"I wake up and make a difference in this world", "category":"Entrepreneurship"},
	{"text":"My business is growing every single day", "category":"Entrepreneurship"},
	{"text":"I am building something that is greater than myself", "category":"Entrepreneurship"},
	{"text":"I am fulfilling my purpose in life", "category":"Entrepreneurship"},
	{"text":"I forgive myself", "category":"Forgiveness"},
	{"text":"What I did is in the past and now I can create my future", "category":"Forgiveness"},
	{"text":"I forgive everyone that has hurt me in the past and move forward with a cleansed soul", "category":"Forgiveness"},
	{"text":"I forgive those who have harmed me in my past and peacefully detach from them", "category":"Forgiveness"},
	{"text":"I am rich in health, wealth and love", "category":"General"},
	{"text":"Opportunities and advantages come with each door that I open", "category":"General"},
	{"text":"The more I give to the world, the more I get", "category":"General"},
	{"text":"What I currently do is serving me towards my higher purpose", "category":"General"},
	{"text":"I have the power to change my thoughts in a second", "category":"General"},
	{"text":"I'm allowed to do what I want with my life", "category":"General"},
	{"text":"I have the power to change myself", "category":"General"},
	{"text":"I allow myself to play and enjoy life", "category":"General"},
	{"text":"I am making a difference in this world", "category":"General"},
	{"text":"I am at peace with all that has happened, is happening, and will happen", "category":"General"},
	{"text":"My life is just beginning", "category":"General"},
	{"text":"Today, I abandon my old habits and take up new, more positive ones", "category":"Breaking Bad Habits"},
	{"text":"I've given up my bad habits and I'm so grateful for that", "category":"Breaking Bad Habits"},
	{"text":"I am now free from my bad habits", "category":"Breaking Bad Habits"},
	{"text":"I only do positive habits", "category":"Breaking Bad Habits"},
	{"text":"I am thankful that I get to live another day", "category":"Gratitude"},
	{"text":"I see the world with beauty and colour", "category":"Gratitude"},
	{"text":"I deserve whatever good comes my way today", "category":"Gratitude"},
	{"text":"Today is rich with opportunity and I open my heart to receive them", "category":"Gratitude"},
	{"text":"I take the time to show my friends that I care about them", "category":"Gratitude"},
	{"text":"I live a positive life and only attract the best in my life", "category":"Happiness"},
	{"text":"I am peacefully allowing my life to unfold", "category":"Happiness"},
	{"text":"Today, and every day, I choose to be happy", "category":"Happiness"},
	{"text":"I am fun and energetic and people love me for it", "category":"Happiness"},
	{"text":"My life overflows with happiness and love", "category":"Happiness"},
	{"text":"I always have everything I need to be happy", "category":"Happiness"},
	{"text":"I fuel my mind with healthy thoughts", "category":"Health"},
	{"text":"I fuel my body with healthy foods", "category":"Health"},
	{"text":"I eat foods that energise and sustain me", "category":"Health"},
	{"text":"I fuel my mind and body with exercise", "category":"Health"},
	{"text":"I feel every cell in my body get healthier every day", "category":"Health"},
	{"text":"Every day my mind and body are becoming more healthy and energetic", "category":"Health"},
	{"text":"I think, act and communicate like a leader", "category":"Leadership"},
	{"text":"I am an inspirational leader", "category":"Leadership"},
	{"text":"I am a role-model for others", "category":"Leadership"},
	{"text":"I inspire others to be their best self", "category":"Leadership"},
	{"text":"I lead by example", "category":"Leadership"},
	{"text":"I am an effective communicator", "category":"Leadership"},
	{"text":"I give my love to the world and the world sends me love in return", "category":"Love"},
	{"text":"Today, and every day, I choose to give to the world", "category":"Love"},
	{"text":"Today, and every day, I choose to make a difference in this world", "category":"Love"},
	{"text":"Everywhere I look I see love", "category":"Love"},
	{"text":"The partner I seek is also seeking me", "category":"Love"},
	{"text":"I love my partner with all my heart", "category":"Love"},
	{"text":"I am thankful that I get to share this beautiful life with my partner", "category":"Love"},
	{"text":"I surround myself with positive and loving people", "category":"Love"},
	{"text":"Today I could meet the love of my life", "category":"Love"},
	{"text":"I am ready to be in love", "category":"Love"},
	{"text":"I love myself more every day", "category":"Love"},
	{"text":"I am blessed with an incredible family and wonderful friends", "category":"Love"},
	{"text":"I always have enough money to suit my needs", "category":"Money"},
	{"text":"Money flows to me like a beautiful gold river", "category":"Money"},
	{"text":"I love watching my money grow", "category":"Money"},
	{"text":"I am full of money-making ideas", "category":"Money"},
	{"text":"My income is continuously increasing", "category":"Money"},
	{"text":"I am generous with money as I know it will return in magnitude", "category":"Money"},
	{"text":"Today, I claim my share", "category":"Money"},
	{"text":"Money flows freely and abundantly into my life", "category":"Money"},
	{"text":"I deserve to be rich", "category":"Money"},
	{"text":"I love facing challenges - they allow me to grow Overcoming", "category":"Challenges"},
	{"text":"There is a benefit and an opportunity in every experience I have Overcoming", "category":"Challenges"},
	{"text":"My attitude grows happier and healthier every single day Overcoming", "category":"Challenges"},
	{"text":"I am always in the right place at the right time Overcoming", "category":"Challenges"},
	{"text":"I have everything I need to overcome this challenge Overcoming", "category":"Challenges"},
	{"text":"I am a better person due to the challenges I've faced Overcoming", "category":"Challenges"},
	{"text":"I learn and grow from every experience Overcoming", "category":"Challenges"},
	{"text":"Everything that is happening now is happening for my ultimate good Overcoming", "category":"Challenges"},
	{"text":"I am breaking old habits and creating new successful ones", "category":"Productivity"},
	{"text":"I become more productive every single day", "category":"Productivity"},
	{"text":"I have unwavering discipline and because of this I will succeed", "category":"Productivity"},
	{"text":"I always win because I am willing to work harder than anyone else", "category":"Productivity"},
	{"text":"I will die before I give up", "category":"Productivity"},
	{"text":"Time is the most valuable resource, therefore I spend it wisely", "category":"Productivity"},
	{"text":"I am disciplined and productive in everything that I do", "category":"Productivity"},
	{"text":"I am the most beautiful person I know", "category":"Self-worth"},
	{"text":"I have a heart of gold and share this with the world", "category":"Self-worth"},
	{"text":"I have the power, right now, to decide what I want to do", "category":"Self-worth"},
	{"text":"I am a gift to the world", "category":"Self-worth"},
	{"text":"I am unique and have so much to offer this world", "category":"Self-worth"},
	{"text":"I am the definition of sexy", "category":"Self-worth"},
	{"text":"I have the power to say yes and say no", "category":"Success"},
	{"text":"I choose to do what matters most to me everyday", "category":"Success"},
	{"text":"Today, and every day, I choose to be successful", "category":"Success"},
	{"text":"I make choices based on inspiration and not desperation", "category":"Success"},
	{"text":"I am a magnet for success and good fortune", "category":"Success"},
	{"text":"Today, I am stronger and wiser than I was yesterday", "category":"Success"},
	{"text":"I am a genius and I apply my wisdom everyday", "category":"Success"},
	{"text":"I am a magnet for other like-minded and successful people", "category":"Success"},
	{"text":"Every day, in every way, I am becoming more successful", "category":"Success"},
	{"text":"Prosperity and success is my natural state of mind", "category":"Success"},
	{"text":"I am an example of success and triumph", "category":"Success"},
	{"text":"I demonstrate excellence in everything I do", "category":"Success"},
	{"text":"My life is an adventure filled with opportunity and reward", "category":"Success"},
	{"text":"I am committed to my goals", "category":"Success"},
	{"text":"I bring solutions", "category":"Success"},
	{"text":"Today, and every day, I am moving a step closer to my goals", "category":"Success"},
	{"text":"I am focused on and moving towards my higher purpose", "category":"Success"},
	{"text":"I do meaningful work that positively impacts this world", "category":"Success"},
	{"text":"I am open to opportunities", "category":"Success"},
	{"text":"I am the definition of success", "category":"Success"},
	{"text":"I deserve to be successful", "category":"Success"}
	]

async function go() {
    await db.connectToMongo()
    if (await db.db.listCollections({ name: 'users' }).hasNext())
        await db.users.drop()
    if (await db.db.listCollections({ name: 'messages' }).hasNext())
		await db.messages.drop()
    await Promise.all(users.map(async user => {
        return await db.users.insertOne(user)
    }))
    const points = turf.randomPoint(messages.length, {bbox: [-81.20022743940353,28.600748350532783, -81.19752377271652, 28.602848915574334]})
	await Promise.all(messages.map(async (message, idx) => {
        let feature = <Feature<Point, Message>>points.features[idx]
        if (!feature.properties) feature.properties = { text: "Unspecified", category: "None", date: new Date(), numReports: 0}
		feature.properties = {text: message.text, category: message.category, date: new Date(), numReports: 0}
		return await db.messages.insertOne({
            _id: new mongodb.ObjectID(),
            feature: feature,
            creator: users[idx % users.length]._id,
		})
	}))
    db.disconnectFromMongo()
    return "Success!!"
}
go().then(console.log).catch(console.error)
