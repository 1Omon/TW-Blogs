import Blog from "../Blog/model.js";
import User from "../user/model.js"


module.exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Blog.find().populate('author', 'name');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the posts.' });
    }
};

module.exports.getPostById = async (req, res, next) => {
    const { id } = req.params;
    try {
        //there's no name field i=for the author's model so how are you able to access a field like name?
        const post = await Blog.findById(id).populate('author', 'name');
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        res.status(200).json(post);
    } 
    catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the post.' });
    }
}


module.exports.createPosts = async (req, res) => {
    const { title, content, author, type } = req.body;
    try {
        //I think you should check if a post with the same properties as the new one exists 
        //before creating it so we don't get conflicts as users will read two posts with the exact same content
        const newPost = new Blog({ title, content, author, type });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the post.' });
    }
};

module.exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, author, type } = req.body;
    try {
        const updatedPost = await Blog.findByIdAndUpdate(id, { title, content, author, type }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the post.' });
    }
};


module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await Blog.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the post.' });
    }
};