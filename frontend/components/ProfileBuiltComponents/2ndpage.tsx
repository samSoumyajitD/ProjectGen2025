"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import ReactFlow, {
    type Node,
    type Edge,
    addEdge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    type Connection,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button, ButtonGroup } from "@heroui/react"
import { ChevronDown24Regular, ChevronUp24Regular } from "@fluentui/react-icons";
const initialNodes: Node[] = [{ id: "1", data: { label: "Start Learning" }, position: { x: 250, y: 5 }, type: "input" }]

const predefinedNodes: Node[] = [
    { id: "1", data: { label: "Start Learning" }, position: { x: 250, y: 5 }, type: "input" },
    { id: "2", data: { label: "Learn Basics" }, position: { x: 250, y: 100 } },
    { id: "3", data: { label: "Practice Exercises" }, position: { x: 250, y: 200 } },
    { id: "4", data: { label: "Build Projects" }, position: { x: 250, y: 300 } },
    { id: "5", data: { label: "Review and Improve" }, position: { x: 250, y: 400 } },
]

const predefinedEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5" },
]

const SecondPage = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [nodeName, setNodeName] = useState("")
    const [showCustomFlow, setShowCustomFlow] = useState(false)
    const [edgeHistory, setEdgeHistory] = useState<Edge[]>([])
    const [isFlowCollapsed, setIsFlowCollapsed] = useState(false)

    useEffect(() => {
        const savedNodes = localStorage.getItem("skillFlowNodes")
        const savedEdges = localStorage.getItem("skillFlowEdges")
        if (savedNodes) setNodes(JSON.parse(savedNodes))
        if (savedEdges) setEdges(JSON.parse(savedEdges))
    }, [setNodes, setEdges])

    useEffect(() => {
        localStorage.setItem("skillFlowNodes", JSON.stringify(nodes))
        localStorage.setItem("skillFlowEdges", JSON.stringify(edges))
        localStorage.setItem("learningFlow", JSON.stringify({ nodes, edges }));
    }, [nodes, edges])

    const onConnect = useCallback(
        (params: Edge | Connection) => {
            const newEdge = { ...params, id: `e${params.source}-${params.target}` } as Edge
            setEdges((eds) => addEdge(newEdge, eds))
            setEdgeHistory((prev) => [...prev, newEdge])
        },
        [setEdges],
    )

    const handleAddNode = () => {
        if (nodeName) {
            const newNode: Node = {
                id: (nodes.length + 1).toString(),
                data: { label: nodeName },
                position: { x: Math.random() * 500, y: Math.random() * 500 },
            }
            setNodes((nds) => nds.concat(newNode))
            setNodeName("")
        }
    }

    const handleNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
        const newLabel = prompt("Enter new label:", node.data.label)
        if (newLabel !== null) {
            setNodes((nds) =>
                nds.map((n) => {
                    if (n.id === node.id) {
                        return { ...n, data: { ...n.data, label: newLabel } }
                    }
                    return n
                }),
            )
        }
    }

    const handleDeleteNode = (nodeId: string) => {
        if (window.confirm("Are you sure you want to delete this node?")) {
            setNodes((nds) => nds.filter((n) => n.id !== nodeId))
            setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
        }
    }

    const handleUndoLastConnection = () => {
        if (edgeHistory.length > 0) {
            const lastEdge = edgeHistory[edgeHistory.length - 1]
            setEdges((eds) => eds.filter((e) => e.id !== lastEdge.id))
            setEdgeHistory((prev) => prev.slice(0, -1))
        }
    }

    const handleClearDiagram = () => {
        if (window.confirm("Are you sure you want to clear the diagram?")) {
            setNodes(initialNodes)
            setEdges([])
            setEdgeHistory([])
            localStorage.removeItem("skillFlowNodes")
            localStorage.removeItem("skillFlowEdges")
        }
    }

    const handleUsePredefinedFlow = () => {
        setNodes(predefinedNodes)
        setEdges(predefinedEdges)
        setEdgeHistory(predefinedEdges)
        setShowCustomFlow(false)
    }

    const handleCustomizeFlow = () => {
        setShowCustomFlow(true)
    }

    const toggleFlowCollapse = () => {
        setIsFlowCollapsed(!isFlowCollapsed)
    }

    return (
        <div className="h-screen w-full flex flex-col bg-gray-50 font-sans overflow-hidden">

            <div className="p-4 bg-white space-y-2">
                <h1 className="text-3xl font-semibold text-gray-900">Learning Flow Builder</h1>
                <p className="text-gray-500 text-sm">
                    Craft your ultimate learning journey with interactive.  Customize. Iterate. Level up.
                </p>
            </div>

            {/* Header Section */}
            <div className="p-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 bg-white shadow-sm">
                <div className="w-full md:flex-grow">
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="nodeName"
                        type="text"
                        value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                        placeholder="Enter node name"
                    />
                </div>

                <ButtonGroup className="w-full md:w-auto mt-4 md:mt-0">
    <Button
        onPress={handleAddNode}
        className="bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
    >
        Add
    </Button>
    <Button
        onPress={handleUsePredefinedFlow}
        className="bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
    >
        Suggest
    </Button>
    <Button
        onPress={handleUndoLastConnection}
        className="bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:from-purple-500 hover:to-purple-600 active:from-purple-600 active:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
        isDisabled={edgeHistory.length === 0}
    >
        Undo
    </Button>
    <Button
        onPress={handleClearDiagram}
        className="bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600 active:from-red-600 active:to-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
    >
        Clear
    </Button>
</ButtonGroup>
            </div>

            {/* Flow Display Section */}
            <div className="p-4 bg-white shadow-sm">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Current Learning Flow</h2>
                    <button
                        onClick={toggleFlowCollapse}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                        {isFlowCollapsed ? <ChevronDown24Regular /> : <ChevronUp24Regular />}
                    </button>
                </div>
                {!isFlowCollapsed && (
                    <div className="flex flex-wrap text-[12px] space-x-2 mt-2">
                        {nodes.map((node, index) => (
                            <div key={node.id} className="flex items-center space-x-2 mb-2">
                                <span className="text-gray-700">{index + 1}.</span>
                                <span className="text-gray-900">{node.data.label}</span>
                                <button
                                    onClick={() => handleDeleteNode(node.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ReactFlow Container */}
            <div className="flex-grow p-4 overflow-hidden">
                <div className="h-full w-full rounded-lg bg-white shadow-sm">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeDoubleClick={handleNodeDoubleClick}
                        fitView
                    >
                        <Controls />
                        <MiniMap />
                        <Background gap={12} size={1} />
                    </ReactFlow>
                </div>
            </div>
        </div>
    )
}

export default SecondPage