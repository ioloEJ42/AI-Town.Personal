import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { insertInput } from './aiTown/insertInput';
import { conversationId, playerId, GameId } from './aiTown/ids';
import { PlayerDescription } from './aiTown/playerDescription';

export const listMessages = query({
  args: {
    worldId: v.id('worlds'),
    conversationId,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('conversationId', (q) => q.eq('worldId', args.worldId).eq('conversationId', args.conversationId))
      .collect();
    const out = [];
    for (const message of messages) {
      const playerDescription = await ctx.db
        .query('playerDescriptions')
        .withIndex('worldId', (q) => q.eq('worldId', args.worldId).eq('playerId', message.author))
        .first();
      if (!playerDescription) {
        throw new Error(`Invalid author ID: ${message.author}`);
      }
      out.push({ ...message, authorName: playerDescription.name });
    }
    return out;
  },
});

export const writeMessage = mutation({
  args: {
    worldId: v.id('worlds'),
    conversationId,
    messageUuid: v.string(),
    playerId,
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      author: args.playerId,
      messageUuid: args.messageUuid,
      text: args.text,
      worldId: args.worldId,
    });
    await insertInput(ctx, args.worldId, 'finishSendingMessage', {
      conversationId: args.conversationId,
      playerId: args.playerId,
      timestamp: Date.now(),
    });
  },
});


export const listallMessages = query({
  handler: async (ctx) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex("conversationId")
      .order("asc")
      .collect();
    const authors = await ctx.db
    .query("playerDescriptions")
    .collect();
    const authorMap = new Map();
    for (const author of authors) {
      authorMap.set(author.playerId, author.name);
    }
    const result = messages.map(message => ({
      ...message,
      authorName: authorMap.get(message.author) || "Unknown"
    }));
    return result;
  },
  
});





export const checkRole = query({
  args: {
    userName:v.string(),
  },
  handler: async (ctx, args) => {
    console.log("a")
    const roles =  await ctx.db.query("playerDescriptions")
    .filter((q) => q.eq(q.field("name"), args.userName))
    .first()
    if (roles?.role == "0"||roles?.role == "1"){
      console.log("returning yay")
      return roles
    }
  },
});

export const getPlayerFromId = query({
  args: {
    userId:v.string(),
  },
  handler: async (ctx, args) => {
    console.log("a")
    const roles =  await ctx.db.query("playerDescriptions")
    .filter((q) => q.eq(q.field("playerId"), args.userId))
    .first()
    if (roles?.role == "0"||roles?.role == "1"){
      console.log("returning yay")
      return roles
    }
  },
});



export const updateRole = mutation({
  args: {
    a: v.id('playerDescriptions'),
  },
  handler: async (ctx, args) => {
    console.log("awooga")
    await ctx.db.patch(args.a,{role:"3"} )
   
  },


});