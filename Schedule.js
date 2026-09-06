import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "../styles/Schedule.css";

function Schedule() {

    const [posts, setPosts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchScheduledPosts();
    }, []);

    const fetchScheduledPosts = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                return;
            }

            console.log("Fetching scheduled posts...");

            const response = await axios.get(
                "http://localhost:5001/api/posts/scheduled",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "Scheduled posts received:",
                response.data
            );

            setPosts(response.data);

        } catch (error) {

            console.log(
                "Schedule Error:",
                error
            );

            console.log(
                "Server Error:",
                error.response?.data
            );

        }

    };

    // Check whether a post is scheduled on a particular date
    const getPostsForDate = (date) => {

        return posts.filter((post) => {

            if (!post.scheduledTime) {
                return false;
            }

            const postDate = new Date(post.scheduledTime);

            return (
                postDate.getFullYear() === date.getFullYear() &&
                postDate.getMonth() === date.getMonth() &&
                postDate.getDate() === date.getDate()
            );

        });

    };

    // Display post information inside calendar dates
    const tileContent = ({ date, view }) => {

        if (view !== "month") {
            return null;
        }

        const dayPosts = getPostsForDate(date);

        if (dayPosts.length === 0) {
            return null;
        }

        return (
            <div className="calendar-posts">

                {dayPosts.map((post) => (

                    <div
                        key={post._id}
                        className="calendar-post"
                    >

                        📌 {post.title}

                    </div>

                ))}

            </div>
        );

    };

    // Show posts for selected date
    const selectedDatePosts =
        getPostsForDate(selectedDate);

    return (

        <div className="schedule-container">

            <h1>
                Post Calendar
            </h1>

            <p>
                Select a date to view scheduled posts.
            </p>

            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
            />

            <div className="selected-posts">

                <h2>
                    Scheduled Posts
                </h2>

                {selectedDatePosts.length === 0 ? (

                    <p>
                        No posts scheduled for this date.
                    </p>

                ) : (

                    selectedDatePosts.map((post) => (

                        <div
                            className="scheduled-post-card"
                            key={post._id}
                        >

                            <h3>
                                {post.title}
                            </h3>

                            <p>
                                Platform: {post.platform}
                            </p>

                            <p>
                                Content: {post.content}
                            </p>

                            <p>
                                Scheduled Time:{" "}
                                {new Date(
                                    post.scheduledTime
                                ).toLocaleString()}
                            </p>

                            <p>
                                Status: {post.status}
                            </p>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default Schedule;
