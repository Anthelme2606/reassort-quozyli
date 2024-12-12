const jwt = require("jsonwebtoken");
const secretKey=process.env.SECRET_KEY;
const getUser = async (token) => {
  try {
    if (token) {
       
      const user = jwt.verify(token, secretKey);
      
      return user;
    }
    return null;
  } catch (error) {
    throw error;
  }  
};

const context = async ({ req, res }) => {

  if (req.body.operationName === "IntrospectionQuery") {
   
    return {};
  }
  
  if ( req.body.operationName === "AddToReassort" || req.body.operationName==='ToggleState'||  req.body.operationName==='UpdateQuantity' || req?.body?.operationName==="PlanReassort" || req.body.operationName === "RemoveProductFromReassort" || req.body.operationName === "GetReassort" || req.body.operationName==="GetProjets" || req.body.operationName === "Login" 
  ) {
   
    return {};
  }

  
  const token = req.headers.authorization || "";

  // try to retrieve a user with the token
  const user = await getUser(token);
  
 

   if (!user) {
    throw new Error("User is not Authenticated...");
   }

 
  return  user ;
};


const  verifyToken= async(token)=> {
  try {
   
    const user = await getUser(token);
   
   
    return user; 
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid or expired token');
  }
}




module.exports = {context,verifyToken};
