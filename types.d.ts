interface Post {
    id: number;
    title: string;
    content: string;
    createdAt:string;
    updatedAt:string;
    deletedAt:string|null;
    author: any;
    category: any;
    comments: any;
}

interface Comment {
    id: string;
    content: string;
    author: any;
    createdAt : Date;
}