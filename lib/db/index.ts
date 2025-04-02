import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid"
const dataFilePath = path.join(process.cwd(), "./data.json");

// Read all comments data
export const readAllComments = () => {
  try {
    if (!fs.existsSync(dataFilePath)) return {}; // If file doesn't exist, return empty object
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading comments:", error);
    return {};
  }
};

// Read comments for a specific article
export const readCommentsByArticle = (articleId:string) => {
  const data = readAllComments();
  return data[articleId] || []; // Return comments for that article or empty array
};

// Write all comments data
export const writeAllComments = (data:any) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
};

// Add a new comment for a specific article
export const addComment = (articleId:string, newComment:any) => {
  
  
  const data = readAllComments();
  
  // Ensure article key exists
  if (!data[articleId]) {
    data[articleId] = [];
  }

  // Generate a unique comment ID and push to array
  const commentWithId = { id:uuidv4(), ...newComment };
  data[articleId].push(commentWithId);
  
  // Write back to file
  writeAllComments(data);

  return data[articleId];
};


// Add a reply to a specific comment
export const addReply = (articleId:any, parentId:any, reply:any) => {
    const data = readAllComments();
  
    if (!data[articleId]) return null; // If article doesn't exist, return null

    const commentWithId = { id:uuidv4(), parentId:parentId, ...reply };
    data[articleId].push(commentWithId);

    writeAllComments(data);
    
    return data[articleId];
  };
  
// Modify vote count on a comment or reply
export const updateVote = (articleId:any, commentId:any, direction:any) => {
    const data = readAllComments();
    if (!data[articleId]) return null;
  
    // Find the comment or reply recursively
    const findAndUpdateVote = (comments:any) => {
      for (let comment of comments) {
        if (comment.id === commentId) {
          if (comment.userVote === direction) {
            // Remove the vote if user clicks the same button again
            if (direction === "up") comment.upvotes--;
            else comment.downvotes--;
            comment.userVote = null;
          } else {
            // Switch vote if already voted the opposite way
            if (comment.userVote) {
              if (direction === "up") {
                comment.upvotes++;
                comment.downvotes--;
              } else {
                comment.downvotes++;
                comment.upvotes--;
              }
            } else {
              // Normal voting
              if (direction === "up") comment.upvotes++;
              else comment.downvotes++;
            }
            comment.userVote = direction;
          }
          return true;
        }
  
        // Recursively check replies
        if (comment.replies?.length) {
          const found = findAndUpdateVote(comment.replies);
          if (found) return true;
        }
      }
      return false;
    };
  
    const updated = findAndUpdateVote(data[articleId]);
  
    if (!updated) return null; // If comment not found
  
    writeAllComments(data);
    return data[articleId]; // Return updated comments array
  };
  