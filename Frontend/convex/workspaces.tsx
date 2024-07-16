import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Create workspace without conversations
export const createWorkspace = mutation({
    args: {
      name: v.string(),
      teamId: v.string(),
      userId: v.string(),
      archive: v.boolean()
    },
    handler: async (ctx, args) => {
      const workspace = {
        ...args,
        conversations: [],
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      };
      const result = await ctx.db.insert('workspaces', workspace);
      return result;
    },
  });
  

export const getWorkspaces = query({
    args: {
        teamId: v.string()
    },
    handler: async (ctx, args) => {
        const result = ctx.db.query('workspaces')
            .filter(q => q.eq(q.field('teamId'), args.teamId))
            .order('desc')
            .collect();

        return result;
    },
})

export const getWorkspaceById = query({
    args: {
      _id: v.id('workspaces'),
      userId: v.string()
    },
    handler: async (ctx, args) => {
      const workspace = await ctx.db.get(args._id);
      if (workspace.createdBy !== args.userId) {
        throw new Error('Access denied');
      }
      return workspace;
    },
  });

// Add a conversation to a workspace
export const addConversation = mutation({
    args: {
      _id: v.id('workspaces'),
      userId: v.string(),
      conversation: v.object({
        conversationId: v.string(),
        messages: v.array(v.array(v.string())), // array of pairs ["ai", "message"] or ["useer", "message"]
        whiteboardData: v.string(),
        diagramType: v.string(),
        createdBy: v.string(),
        createdOn: v.string(),
        updatedBy: v.string(),
        updatedOn: v.string(),
      })
    },
    handler: async (ctx, args) => {
      const workspace = await ctx.db.get(args._id);
      if (workspace.createdBy !== args.userId) {
        throw new Error('Access denied');
      }
      const updatedConversations = [...workspace.conversations, args.conversation];
      const result = await ctx.db.patch(args._id, { conversations: updatedConversations, updatedOn: new Date() });
      return result;
    }
  });

 // Edit workspace by modifying conversations
export const editWorkspace = mutation({
    args: {
      _id: v.id('workspaces'),
      userId: v.string(),
      action: v.union(
        v.object({
          type: v.literal('add'),
          conversation: v.object({
            conversationId: v.string(),
            conversationName: v.string(),
            messages: v.array(v.array(v.string())), // array of arrays (nested array)
            whiteboardData: v.string(),
            diagramType: v.string(),
            createdBy: v.string(),
            createdOn: v.string(),
            updatedBy: v.string(),
            updatedOn: v.string(),
          })
        }),
        v.object({
          type: v.literal('edit'),
          conversation: v.object({
            conversationId: v.string(),
            conversationName: v.string(),
            messages: v.array(v.array(v.string())), // array of arrays (nested array)
            whiteboardData: v.string(),
            diagramType: v.string(),
            createdBy: v.string(),
            createdOn: v.string(),
            updatedBy: v.string(),
            updatedOn: v.string(),
          })
        }),
        v.object({
          type: v.literal('delete'),
          conversationId: v.string(),
        })
      )
    },
    handler: async (ctx, args) => {
      const workspace = await ctx.db.get(args._id);
      if (workspace.createdBy !== args.userId) {
        throw new Error('Access denied');
      }
  
      let updatedConversations;
  
      switch (args.action.type) {
        case 'add':
          updatedConversations = [...workspace.conversations, args.action.conversation];
          break;
        case 'edit':
          updatedConversations = workspace.conversations.map((conv: unknown) =>
            // @ts-ignore
            conv.conversationId === args.action.conversation.conversationId ? args.action.conversation : conv
          );
          break;
        case 'delete':
            // @ts-ignore
          updatedConversations = workspace.conversations.filter(conv => conv.conversationId !== args.action.conversationId);
          break;
        default:
          throw new Error('Invalid action type');
      }
  
      const result = await ctx.db.patch(args._id, {
        conversations: updatedConversations,
        updatedBy: args.userId,
        updatedOn: new Date(),
      });
  
      return result;
    },
  });