const {Prisma} =  require('prisma-binding');
const {GraphQLServer} =  require('graphql-yoga');

const resolvers = {
  Query: {
    books: (root, args, context, info) => {
      return context.prisma.query.books({where: {OR: [{title_contains: args.searchString}]}}, info)
    },
    user: (root, args, context, info) => context.prisma.query.user({where: {id: args.id}}, info)
  },
  Mutation: {
    signup: (root, args, context, info) => context.prisma.mutation.createUser({data: {name: args.name}}, info),
    deleteBook: (root, args, context, info) => context.prisma.mutation.deleteBook({where: {id: args.id}}, info),
    updateBook: (root, args, context, info) => {
      const {id, title, author, excerpt, uploaderId} = args, data = {};

      if (title !== undefined) {
        data.title = title;
      }

      if (author !== undefined) {
        data.author = author;
      }

      if (excerpt !== undefined) {
        data.excerpt = excerpt;
      }

      if (uploaderId !== undefined) {
        data.uploader = {connect: {id: uploaderId}};
      }

      return context.prisma.mutation.updateBook({where: {id}, data}, info);
    },
    uploadBook: (root, args, context, info) => {
      const {title, author, excerpt, uploaderId} = args;
      return context.prisma.mutation.createBook({
        data: {
          title,
          author,
          excerpt,
          uploader: {
            connect: {
              id: uploaderId
            }
          }
        }
      }, info)
    }
  }
};

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/jondgarvey/hello-prisma/dev'
    })
  })
});

server.start(() => console.log('GraphQL server is running on http://localhost:4000'));