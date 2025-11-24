import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import * as yaml from 'js-yaml';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

async function migratePosts() {
    const files = fs.readdirSync(POSTS_DIR);

    for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: body } = matter(content);

        // Check if date has minute = 1 (the old hack)
        if (data.date) {
            const date = new Date(data.date);
            if (date.getMinutes() === 1) {
                data.showMonth = false;
                console.log(`${file}: Setting showMonth=false (was using minute hack)`);
            } else {
                data.showMonth = true;
                console.log(`${file}: Setting showMonth=true`);
            }
        }

        // Write updated content
        const newContent = `---\n${yaml.dump(data)}---\n\n${body}`;
        fs.writeFileSync(filePath, newContent);
    }

    console.log('Finished migrating showMonth parameter!');
}

migratePosts();
