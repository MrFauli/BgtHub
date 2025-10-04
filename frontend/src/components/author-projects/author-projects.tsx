
import { Link,useParams } from "react-router-dom";

import Posts from '../../posts.json';

function AuthorProjects(){
    const {author} = useParams();
    const articles = Posts.filter(p => p.author == author);
    return(
        <div>
            {articles.map((article)=>(
                <h1><Link to={`/projekte/${article.slug}`}>{article.title}</Link></h1>
            ))}
        </div>
    )
}
export default AuthorProjects;