import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import * as yaml from 'js-yaml';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function createSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single
        .trim();
}

async function renamePosts() {
    const files = fs.readdirSync(POSTS_DIR);

    for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const oldPath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(oldPath, 'utf8');
        const { data, content: body } = matter(content);

        if (!data.title) {
            console.log(`Skipping ${file}: no title found`);
            continue;
        }

        const slug = createSlug(data.title);
        const newFilename = `${slug}.md`;
        const newPath = path.join(POSTS_DIR, newFilename);

        // Check if file with new name already exists
        if (fs.existsSync(newPath) && newPath !== oldPath) {
            console.log(`Skipping ${file}: ${newFilename} already exists`);
            continue;
        }

        // Update the id in frontmatter
        data.id = slug;

        // Write updated content
        const newContent = `---\n${yaml.dump(data)}---\n\n${body}`;
        fs.writeFileSync(oldPath, newContent);

        // Rename file
        if (file !== newFilename) {
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed: ${file} -> ${newFilename}`);
        } else {
            console.log(`Updated: ${file}`);
        }
    }

    console.log('Finished renaming posts!');
}

renamePosts();
