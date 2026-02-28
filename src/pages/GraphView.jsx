import { useCallback, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../components/CustomNode';
import { useApp } from '../context/AppContext';

export default function GraphView() {
    const { id } = useParams();
    const { contexts } = useApp();
    const currentContext = contexts.find(c => c.id === parseInt(id)) || contexts[0];

    const initialNodes = useMemo(() => {
        const nodes = [
            {
                id: 'center',
                position: { x: 400, y: 300 },
                data: { label: currentContext.name, type: 'context' },
                type: 'custom'
            }
        ];

        const items = [
            ...currentContext.notes,
            ...currentContext.tasks,
            ...currentContext.files,
            ...(currentContext.deadlines || [])
        ];

        items.forEach((item, index) => {
            const angle = (index / items.length) * 2 * Math.PI;
            const radius = 250;
            nodes.push({
                id: item.id.toString(),
                position: {
                    x: 400 + radius * Math.cos(angle),
                    y: 300 + radius * Math.sin(angle)
                },
                data: { label: item.title, type: item.type },
                type: 'custom'
            });
        });

        return nodes;
    }, [currentContext]);

    const initialEdges = useMemo(() => {
        const items = [
            ...currentContext.notes,
            ...currentContext.tasks,
            ...currentContext.files,
            ...(currentContext.deadlines || [])
        ];

        return items.map(item => ({
            id: `e-${item.id}`,
            source: 'center',
            target: item.id.toString(),
            animated: false,
            style: { stroke: '#06B6D4', strokeWidth: 2 },
            className: 'animated-edge'
        }));
    }, [currentContext]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

    const itemCount = currentContext.notes.length + currentContext.tasks.length + currentContext.files.length;

    return (
        <div className="w-full h-full relative animate-pop-in">

            {/* Absolute top info/legends overlays */}
            <div className="absolute top-6 left-8 z-10 flex gap-4 text-slate-400 text-sm font-medium">
                <span>{itemCount + 1} nodes</span>
                <span>·</span>
                <span>{itemCount} relationships</span>
            </div>

            <div className="absolute top-6 right-8 z-10 flex flex-wrap justify-end gap-3 max-w-[500px]">
                {[
                    { label: 'context', color: 'bg-primary' },
                    { label: 'note', color: 'bg-purple-500' },
                    { label: 'task', color: 'bg-green-500' },
                    { label: 'deadline', color: 'bg-red-500' },
                    { label: 'member', color: 'bg-teal-500' },
                    { label: 'file', color: 'bg-pink-500' }
                ].map(legend => (
                    <div key={legend.label} className="flex items-center gap-2 bg-surface/80 border border-slate-700/50 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm shrink-0">
                        <div className={`w-2 h-2 rounded-full ${legend.color}`}></div>
                        <span className="text-xs text-slate-300 capitalize">{legend.label}</span>
                    </div>
                ))}
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                className="bg-transparent"
                minZoom={0.5}
                maxZoom={2}
            >
                <Background
                    color="#334155"
                    gap={24}
                    size={2}
                    className="opacity-40"
                />
                <Controls
                    className="bg-surface/80 border-slate-700/50 fill-white"
                    showInteractive={false}
                />
            </ReactFlow>

            {/* Floating UI Card Bottom Left */}
            <div className="absolute bottom-8 left-8 z-10 w-64 glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,1)]"></div>
                    <h3 className="text-white font-bold tracking-tight">{currentContext.name}</h3>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/30 rounded-full tracking-widest uppercase">
                    Context
                </span>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed font-medium">
                    Connected to {itemCount} other nodes
                </p>
            </div>
        </div>
    );
}
