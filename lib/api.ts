import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import { MetaInfo, LinkObject, Category, Page, Post, PageInfo, PublicInfo } from '../modules/interfaces';


const CONTENT_DIR = path.join(process.cwd(), 'content');

function serialize(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'object') {
        if (Buffer.isBuffer(obj) || obj instanceof Uint8Array) {
            return Buffer.from(obj as any).toString('hex');
        }
        if (obj instanceof Date) {
            return obj.toISOString();
        }
        if (Array.isArray(obj)) {
            return obj.map(serialize);
        }
        const newObj: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = serialize(obj[key]);
            }
        }
        return newObj;
    }
    return obj;
}

export function getMeta(): MetaInfo {
    const fileContents = fs.readFileSync(path.join(CONTENT_DIR, 'meta.yaml'), 'utf8');
    return serialize(yaml.load(fileContents)) as MetaInfo;
}

export function getLinks(): LinkObject[] {
    const fileContents = fs.readFileSync(path.join(CONTENT_DIR, 'links.yaml'), 'utf8');
    const links = yaml.load(fileContents) as any[];
    return serialize(links.map(l => ({ ...l, _id: l.id || l._id }))) as LinkObject[];
}

export function getCategories(): Category[] {
    const fileContents = fs.readFileSync(path.join(CONTENT_DIR, 'categories.yaml'), 'utf8');
    const categories = yaml.load(fileContents) as any[];
    return serialize(categories.map(c => ({ ...c, _id: c.id || c._id }))) as Category[];
}

export function getPages(): Page[] {
    const pagesDir = path.join(CONTENT_DIR, 'pages');
    const files = fs.readdirSync(pagesDir);
    return files.map(filename => {
        const fileContents = fs.readFileSync(path.join(pagesDir, filename), 'utf8');
        const { data, content } = matter(fileContents);
        return serialize({
            ...data,
            content,
            _id: data.id || filename.replace(/\.md$/, '')
        }) as Page;
    });
}

export function getPage(id: string): Page | null {
    const filePath = path.join(CONTENT_DIR, 'pages', `${id}.md`);
    if (!fs.existsSync(filePath)) return null;
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return serialize({
        ...data,
        content,
        _id: data.id || id
    }) as Page;
}

export function getPosts(): Post[] {
    const postsDir = path.join(CONTENT_DIR, 'posts');
    const files = fs.readdirSync(postsDir);
    const posts = files.map(filename => {
        const fileContents = fs.readFileSync(path.join(postsDir, filename), 'utf8');
        const { data, content } = matter(fileContents);
        return serialize({
            ...data,
            description: content,
            _id: data.id || filename.replace(/\.md$/, '')
        }) as Post;
    });
    // Sort by date desc
    return posts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export function getPost(id: string): (Post & { content: string }) | null {
    const filePath = path.join(CONTENT_DIR, 'posts', `${id}.md`);
    if (!fs.existsSync(filePath)) return null;
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return serialize({
        ...data,
        content,
        _id: data.id || id
    }) as Post & { content: string };
}


export function getPublicInfo(): PublicInfo {
    const meta = getMeta();
    const links = getLinks();
    const categories = getCategories();
    const staticPages = getPages();

    const pages: PageInfo[] = [];

    categories.forEach(cat => {
        pages.push({
            path: "/c/" + (cat.id || cat._id),
            name: cat.name,
            highlighted: cat.highlighted
        });
    });

    staticPages.forEach(page => {
        pages.push({
            path: "/" + (page.id || page._id),
            name: page.name,
            highlighted: page.highlighted
        });
    });

    // Sort pages if needed, or keep order. Original code sorted by _id.
    // Here we might want to sort by name or something, but let's leave it as is.

    return {
        meta,
        links,
        categories,
        pages,
        publicurl: process.env.NEXTAUTH_URL || "" // Or hardcode if static
    };
}
