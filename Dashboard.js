import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";


function Dashboard() {

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);


    // =====================================================
    // FETCH USER POSTS
    // =====================================================

    useEffect(() => {

        fetchMyPosts();

    }, []);


    const fetchMyPosts = async () => {

        try {

            const token =
                localStorage.getItem("token");


            const response = await axios.get(

                "http://localhost:5001/api/posts/my-posts",

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            setPosts(response.data);

        }

        catch (error) {

            console.log(
                "Fetch Posts Error:",
                error
            );

        }

    };


    // =====================================================
    // DELETE POST
    // =====================================================

    const deletePost = async (id) => {

        try {

            const token =
                localStorage.getItem("token");


            await axios.delete(

                `http://localhost:5001/api/posts/${id}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            alert(
                "Post Deleted Successfully"
            );


            fetchMyPosts();

        }

        catch (error) {

            console.log(
                "Delete Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to delete post"
            );

        }

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem("token");

        alert(
            "Logged Out Successfully"
        );

        navigate("/");

    };


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="dashboard-container">


            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <div className="dashboard-header">

                <h1>
                    Post Composer Dashboard
                </h1>


                <button onClick={logout}>

                    Logout

                </button>

            </div>


            {/* ========================================= */}
            {/* WELCOME */}
            {/* ========================================= */}

            <h2>
                Welcome User
            </h2>


            {/* ========================================= */}
            {/* DASHBOARD CARDS */}
            {/* ========================================= */}

            <div className="card-container">


                {/* TOTAL POSTS */}

                <div className="card">

                    <h3>
                        Total Posts
                    </h3>


                    <h1>
                        {posts.length}
                    </h1>

                </div>


                {/* CREATE POST */}

                <div className="card">

                    <h3>
                        Create New Post
                    </h3>


                    <Link to="/create">

                        <button>
                            Create
                        </button>

                    </Link>

                </div>


                {/* VIEW POSTS */}

                <div className="card">

                    <h3>
                        View All Posts
                    </h3>


                    <Link to="/posts">

                        <button>
                            View
                        </button>

                    </Link>

                </div>


                {/* CALENDAR */}

                <div className="card">

                    <h3>
                        Post Calendar
                    </h3>


                    <Link to="/schedule">

                        <button>
                            📅 View Calendar
                        </button>

                    </Link>

                </div>


            </div>


            {/* ========================================= */}
            {/* MY POSTS */}
            {/* ========================================= */}

            <h2>
                My Posts
            </h2>


            {

                posts.length === 0

                    ? (

                        <h3>
                            No Posts Created Yet
                        </h3>

                    )

                    : (

                        posts.map((post) => (

                            <div
                                className="post-card"
                                key={post._id}
                            >


                                <h3>
                                    {post.title}
                                </h3>


                                <p>
                                    Platform : {post.platform}
                                </p>


                                <p>
                                    Status : {post.status}
                                </p>


                                <p>

                                    Scheduled Time :

                                    {" "}

                                    {

                                        post.scheduledTime

                                            ? new Date(
                                                post.scheduledTime
                                            ).toLocaleString()

                                            : "Not Scheduled"

                                    }

                                </p>


                                {/* EDIT */}

                                <Link
                                    to={`/edit/${post._id}`}
                                >

                                    <button>
                                        Edit
                                    </button>

                                </Link>


                                {/* DELETE */}

                                <button
                                    onClick={() =>
                                        deletePost(
                                            post._id
                                        )
                                    }
                                >

                                    Delete

                                </button>


                            </div>

                        ))

                    )

            }


        </div>

    );

}


export default Dashboard;
