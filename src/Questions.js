import { useState } from "react";
import { FaPlus, FaMinus} from "react-icons/fa";

const Question = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const accordion = [
        {title: 'What is Netflix?', body: "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!", id: 1},
        {title: "How much does Netflix cost?", body: "Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from US$9.99 to US$2.99 a month. No extra costs, no contracts.", id: 2},
        {title: "Where can i watch?", body: "Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.You can also download your favorite shows with the iOS, Android, or Windows 10 app. Use downloads to watch while you're on the go and without an internet connection. Take Netflix with you anywhere", id: 3},
        {title: "How do i cancel?", body: "Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.", id: 4},
        {title: "What can i watch on Netflix", body: "Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.", id: 5},
        {title: "Is Netflix good for kids?", body: "The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space.", id: 6},
        ]

    const toggleAccordion = (index) => {
            if (activeIndex === index) {
                setActiveIndex(null);
            } else {
                setActiveIndex(index);
            }
    }

    return(
        <div className="FAQs">
            <h1>Frequently Asked Questions</h1>
            {accordion.map((item, index) => (
        <div className="faq-item" key={item.id}>
            <div className="question" onClick={() => toggleAccordion(index)}>
                <h2 >{item.title}</h2>
                {activeIndex === index ? <FaMinus /> : <FaPlus />}
            </div>
            {activeIndex === index && <div className="answer">{item.body}</div>}
        </div>
    ))}
</div>

    )
}

export default Question;