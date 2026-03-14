const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'terminal');
const outputFile = path.join(__dirname, '_site', 'posts.json');

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));

const posts = files.map(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Meta Extraction
    const isFeatured = content.includes('featured: true');
    
    // Safety check: ensure the variable is always initialized
    let category = 'Intelligence';
    const categoryMatch = content.match(//i);
    
    if (categoryMatch && categoryMatch[1]) {
        category = categoryMatch[1].trim();
    }

    // 2. Content Extraction
    const titleMatch = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : "Untitled Post";
    
    const imageMatch = content.match(/<img.*?src=["'](.*?)["']/i);
    const image = imageMatch ? imageMatch[1] : "default-thumbnail.jpg";
    
    const paraMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const snippet = paraMatch ? paraMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 160) + "..." : "";

    return {
        title,
        image,
        snippet,
        url: `/terminal/${file.replace('.html', '/')}`, 
        date: fs.statSync(filePath).mtime,
        featured: isFeatured,
        category: category
    };
});

// Sort by date (newest first)
const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Ensure build directory exists
if (!fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(sortedPosts, null, 2));
console.log(`Successfully indexed ${sortedPosts.length} posts for The Terminal.`);

// Ensure the directory exists before writing
if (!fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(sortedPosts, null, 2));
console.log(`Manifest generated: ${sortedPosts.length} posts indexed.`);
fs.writeFileSync(outputFile, JSON.stringify(sortedPosts, null, 2));
console.log('Terminal manifest generated successfully.');
