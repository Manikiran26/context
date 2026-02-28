import { motion } from "framer-motion";
import IntelligenceCard from "./IntelligenceCard";
import MembersList from "./MembersList";
import TagsList from "./TagsList";
import ActivityFeed from "./ActivityFeed";

export default function ContextSidebar({ context }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <IntelligenceCard score={context?.score || 87} />
            <MembersList members={context?.members} />
            <TagsList tags={context?.tags} />
            <ActivityFeed activities={context?.activities} />
        </motion.div>
    );
}
