"use client";


import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [comments, setComments] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<{ author: string; totalUpvotes: number }[]>([]);

  const formatCommentsForTable = (commentsData: any) => {
    const userUpvotes: Record<string, number> = {};

    Object.values(commentsData)
      .flat()
      .forEach(({ author, upvotes }: any) => {
        userUpvotes[author] = (userUpvotes[author] || 0) + upvotes;
      });

    return Object.entries(userUpvotes)
      .map(([author, totalUpvotes]) => ({ author, totalUpvotes }))
      .sort((a, b) => b.totalUpvotes - a.totalUpvotes);
  };

  const fetchComments = async () => {
    try {
      const response = await fetch("/api/comments");
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
      setLeaderboard(formatCommentsForTable(data));
    } catch (err: any) {
      console.error("Error fetching comments:", err.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);


  return (
    <div className="w-full max-w-full py-6">
      <h1 className="text-3xl font-bold mb-3 text-black dark:text-white">Leaderboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-5">Top users ranked by upvotes</p>

      <div className="w-full overflow-hidden border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left bg-white dark:bg-gray-900">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Rank</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Author</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">Total Upvotes</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((user, index) => (
                  <tr 
                    key={user.author} 
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{user.author}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">{user.totalUpvotes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {comments === null ? "Loading..." : "No comments found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
