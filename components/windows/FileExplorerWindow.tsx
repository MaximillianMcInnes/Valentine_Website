"use client";

import { useMemo, useState } from "react";

type NodeType = "folder" | "file";

type Node = {
  id: string;
  name: string;
  type: NodeType;
  children?: Node[];
  content?: string; // text file content (e.g. README)
  src?: string; // image src (served from /public)
  youtubeId?: string; // YouTube video id (embed)
};

const FS: Node = {
  id: "root",
  name: "My Computer",
  type: "folder",
  children: [
    {
      id: "c",
      name: "C:",
      type: "folder",
      children: [
        {
          id: "us",
          name: "You and me :0",
          type: "folder",
          children: [
            {
              id: "gallery",
              name: "Gallery",
              type: "folder",
              children: [
                {
                  id: "pets",
                  name: "The little ones",
                  type: "folder",
                  children: [
                    { id: "pet1", name: "_.png", type: "file", src: "/photos/pets/1.jfif" },
                    { id: "pet2", name: "_.png", type: "file", src: "/photos/pets/2.jfif" },
                    { id: "pet3", name: "_.png", type: "file", src: "/photos/pets/3.jfif" },
                    { id: "pet4", name: "_.png", type: "file", src: "/photos/pets/4.jfif" },
                    { id: "pet5", name: "_.png", type: "file", src: "/photos/pets/5.jfif" },
                    { id: "pet6", name: "_.png", type: "file", src: "/photos/pets/6.jfif" },
                    { id: "pet7", name: "_.png", type: "file", src: "/photos/pets/7.jfif" },
                    { id: "pet8", name: "_.png", type: "file", src: "/photos/pets/squirell.png" },

                  ],
                },
                {
                  id: "photos_top10",
                  name: "top 10 jokes",
                  type: "folder",
                  children: [
                    { id: "joke1", name: ".jpg", type: "file", src: "/photos/top10jokes/mem1.jfif" },
                    { id: "joke3", name: "headchair.jpg", type: "file", src: "/photos/top10jokes/headchair.jfif" },
                    { id: "joke4", name: "puregymgood.jpg", type: "file", src: "/photos/top10jokes/puregymgood.jfif" },
                    { id: "joke5", name: "haha.jpg", type: "file", src: "/photos/top10jokes/roncorn.jfif" },
                    { id: "joke7", name: "_.jpg", type: "file", src: "/photos/top10jokes/puregymgood2.png" },

                  ],
                },
                {
                  id: "photos_why",
                  name: "why he looking at me like i did it",
                  type: "folder",
                  children: [
                    { id: "why1", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why2", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why3", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why4", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why5", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why6", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why7", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why8", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why9", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why10", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why11", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why12", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why13", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why14", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why15", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                    { id: "why16", name: "why.jpg", type: "file", src: "/photos/hedidit/rubixcube.jfif" },
                  ],
                },
                {
                  id: "usphotos",
                  name: "theres only one picture of us lmao",
                  type: "folder",
                  children: [
                    { id: "omi", name: "OMI.jpg", type: "file", src: "/photos/selfies/us3.jfif" },
                  ],
                },
                {
                  id: "cooking",
                  name: "cooking...",
                  type: "folder",
                  children: [
                    { id: "ag", name: "_.jpg", type: "file", src: "/photos/cooking/cooking.jfif" },
                    { id: "agh", name: "_.jpg", type: "file", src: "/photos/cooking/cooking2.jfif" },
                    { id: "aghj", name: "_.jpg", type: "file", src: "/photos/cooking/cooking3.png" },

                  ],
                }
              ],
            },

            // Videos: now YouTube embeds (no MP4 in repo)
            {
              id: "film",
              name: "Films",
              type: "folder",
              children: [
                { id: "vlg1", name: "Vlog 1", type: "file", youtubeId: "Vo4g1Syf1to" },
                { id: "vlgpicture", name: ".", type: "file", src: "/photos/moviephotos/cool.JPG" },
                { id: "vlg2", name: "Vlog 2", type: "file", youtubeId: "g4KuPgWy7g8" },
                { id: "vlg3", name: "Vlog 3", type: "file", youtubeId: "Gf6pifI4k2M" },

                // Add more:
                // { id: "vlg2", name: "Vlog 2", type: "file", youtubeId: "ANOTHER_ID" },
              ],
            },

            {
              id: "readme",
              name: "README.txt",
              type: "file",
              content: `helloooooooooo Maggie

Happy Valentines!
You are the most incredible girlfriend I could ask for :)

I was thinking we could use this as an online sanctuary 
for all our memories yet to come. 
(Some are already here haha)

Love,
Ethan`,
            },
          ],
        },
      ],
    },
  ],
};

function findPath(root: Node, targetId: string): Node[] | null {
  if (root.id === targetId) return [root];
  if (!root.children) return null;
  for (const child of root.children) {
    const p = findPath(child, targetId);
    if (p) return [root, ...p];
  }
  return null;
}

function ytThumb(id: string, quality: "max" | "hq" | "mq" | "sd" = "hq") {
  const q =
    quality === "max"
      ? "maxresdefault"
      : quality === "sd"
      ? "sddefault"
      : quality === "mq"
      ? "mqdefault"
      : "hqdefault";
  return `https://i.ytimg.com/vi/${id}/${q}.jpg`;
}



function nodeToPath(nodes: Node[]) {
  const names = nodes.map((n) => n.name);
  const cIndex = names.findIndex((n) => n === "C:");
  if (cIndex === -1) return "My Computer";
  const after = names.slice(cIndex + 1);
  return `C:\\${after.join("\\") || ""}`;
}

function TreeNode({
  node,
  level,
  expanded,
  toggle,
  open,
}: {
  node: Node;
  level: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  open: (node: Node) => void;
}) {
  const isFolder = node.type === "folder";
  const hasChildren = !!node.children?.length;
  const isOpen = expanded.has(node.id);

  const onRowClick = () => {
    open(node);
    if (isFolder && hasChildren && !isOpen) toggle(node.id);
  };

  return (
    <div>
      <div className="treeRow" style={{ paddingLeft: 8 + level * 14 }} onClick={onRowClick}>
        <span
          className="treeTwist"
          onClick={(e) => {
            e.stopPropagation();
            open(node);
            if (isFolder && hasChildren) toggle(node.id);
          }}
        >
          {isFolder && hasChildren ? (isOpen ? "▾" : "▸") : " "}
        </span>

        <span className={`treeIcon ${isFolder ? "treeFolder" : "treeFile"}`} />
        <span className="treeName">{node.name}</span>
      </div>

      {isFolder && hasChildren && isOpen && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              toggle={toggle}
              open={open}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorerWindow({
  onOpenFolder,
}: {
  onOpenFolder?: (id: string) => void;
}) {
  const [currentId, setCurrentId] = useState<string>("us");

  // Image viewer
  const [viewer, setViewer] = useState<null | { folderId: string; fileId: string }>(null);

  // Video viewer (YouTube)
  const [videoViewer, setVideoViewer] = useState<null | { folderId: string; fileId: string }>(
    null
  );

  // Text file modal (replaces alert)
  const [openFile, setOpenFile] = useState<Node | null>(null);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(["root", "c", "us"]));

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pathNodes = useMemo(() => findPath(FS, currentId) ?? [FS], [currentId]);
  const current = pathNodes[pathNodes.length - 1];
  const items = current.children ?? [];

  // Image folder context
  const imgFolderNode = useMemo(
    () => findPath(FS, viewer?.folderId ?? "")?.slice(-1)[0],
    [viewer?.folderId]
  );
  const folderImages = (imgFolderNode?.children ?? []).filter((n) => n.type === "file" && n.src) as Node[];
  const currentIndex = viewer ? folderImages.findIndex((n) => n.id === viewer.fileId) : -1;
  const currentImg = currentIndex >= 0 ? folderImages[currentIndex] : null;

  const prevImg = () => {
    if (!viewer || folderImages.length === 0) return;
    const next = (currentIndex - 1 + folderImages.length) % folderImages.length;
    setViewer({ folderId: viewer.folderId, fileId: folderImages[next].id });
  };
  const nextImg = () => {
    if (!viewer || folderImages.length === 0) return;
    const next = (currentIndex + 1) % folderImages.length;
    setViewer({ folderId: viewer.folderId, fileId: folderImages[next].id });
  };

  // Video folder context
  const videoFolderNode = useMemo(
    () => findPath(FS, videoViewer?.folderId ?? "")?.slice(-1)[0],
    [videoViewer?.folderId]
  );
  const folderVideos = (videoFolderNode?.children ?? []).filter(
    (n) => n.type === "file" && n.youtubeId
  ) as Node[];
  const videoIndex = videoViewer ? folderVideos.findIndex((n) => n.id === videoViewer.fileId) : -1;
  const currentVideo = videoIndex >= 0 ? folderVideos[videoIndex] : null;

  const prevVideo = () => {
    if (!videoViewer || folderVideos.length === 0) return;
    const next = (videoIndex - 1 + folderVideos.length) % folderVideos.length;
    setVideoViewer({ folderId: videoViewer.folderId, fileId: folderVideos[next].id });
  };
  const nextVideo = () => {
    if (!videoViewer || folderVideos.length === 0) return;
    const next = (videoIndex + 1) % folderVideos.length;
    setVideoViewer({ folderId: videoViewer.folderId, fileId: folderVideos[next].id });
  };

  const showPreview = pathNodes.some((n) => n.id === "gallery" || n.id === "film");

  const goUp = () => {
    if (pathNodes.length <= 2) return;
    const parent = pathNodes[pathNodes.length - 2];
    setCurrentId(parent.id);
  };
  const goRoot = () => setCurrentId("us");

  const openNode = (node: Node) => {
    if (node.type === "folder") {
      setCurrentId(node.id);
      onOpenFolder?.(node.id);
      return;
    }

    // File
    if (node.content) {
      setOpenFile(node);
      return;
    }

    if (node.src) {
      // Use current folder as context if possible
      setViewer({ folderId: current.id, fileId: node.id });
      return;
    }

    if (node.youtubeId) {
      setVideoViewer({ folderId: current.id, fileId: node.id });
      return;
    }
  };

  return (
    <div className="fe">
      {/* Menu bar */}
      <div className="feMenu">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Help</span>
      </div>

      {/* Toolbar */}
      <div className="feToolbar">
        <button className="feBtn" onClick={goRoot} title="Home">
          ⌂
        </button>
        <button className="feBtn" onClick={goUp} title="Up">
          ↑
        </button>
        <div className="feSep" />
        <div className="feAddressWrap">
          <span className="feAddrLabel">Address</span>
          <div className="feAddress">{nodeToPath(pathNodes)}</div>
        </div>
      </div>

      {/* Body */}
      <div className={showPreview ? "feBodyTreeOnly" : "feBodyTreeSingle"}>
        <div className="feTree">
          <div className="feTreeTitle">Folders</div>

          <TreeNode
            node={FS}
            level={0}
            expanded={expanded}
            toggle={toggle}
            open={(node) => {
              // Expand folders on open, but don’t force-open leaf folders
              if (node.type === "folder") {
                openNode(node);
                if (node.children?.length && !expanded.has(node.id)) toggle(node.id);
              } else {
                openNode(node);
              }
            }}
          />
        </div>

        {showPreview && (
          <div className="feRightBlank">
            {current.type === "folder" ? (
              <div className="thumbGrid">
                {items.map((it) => (
                  <button
                    key={it.id}
                    className="thumb"
                    onClick={() => {
                      if (it.type === "folder") setCurrentId(it.id);
                      if (it.type === "file" && it.src) setViewer({ folderId: current.id, fileId: it.id });
                      if (it.type === "file" && it.youtubeId)
                        setVideoViewer({ folderId: current.id, fileId: it.id });
                      if (it.type === "file" && it.content) setOpenFile(it);
                    }}
                  >
                  {it.src ? (
                    <img className="thumbImg" src={it.src} alt={it.name} />
                  ) : it.youtubeId ? (
                    <div className="thumbYt">
                      <img
                        className="thumbImg"
                        src={ytThumb(it.youtubeId, "hq")}
                        alt={it.name}
                        loading="lazy"
                      />
                      <div className="thumbPlay">▶</div>
                    </div>
                  ) : (
                    <div className="thumbIcon">{it.type === "folder" ? "📁" : "📄"}</div>
                  )}
                    <div className="thumbName">{it.name}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="blankHint">Select a folder on the left…</div>
            )}
          </div>
        )}
      </div>

      {/* Text file modal */}
      {openFile?.content && (
        <div className="viewerOverlay" onClick={() => setOpenFile(null)}>
          <div className="viewerModal" onClick={(e) => e.stopPropagation()}>
            <div className="viewerTop">
              <div className="viewerTitle">{openFile.name}</div>
              <button className="viewerClose" onClick={() => setOpenFile(null)}>
                ×
              </button>
            </div>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                margin: 0,
                padding: 12,
                lineHeight: 1.4,
              }}
            >
              {openFile.content}
            </pre>
          </div>
        </div>
      )}

      {/* Image viewer */}
      {viewer && currentImg?.src && (
        <div className="viewerOverlay" onClick={() => setViewer(null)}>
          <div className="viewerModal" onClick={(e) => e.stopPropagation()}>
            <div className="viewerTop">
              <div className="viewerTitle">{currentImg.name}</div>
              <button className="viewerClose" onClick={() => setViewer(null)}>
                ×
              </button>
            </div>

            <img className="viewerImg" src={currentImg.src} alt={currentImg.name} />

            <div className="viewerBottom">
              <button className="viewerBtn" onClick={prevImg}>
                ◀ Prev
              </button>
              <div className="viewerCount">
                {currentIndex + 1} / {folderImages.length}
              </div>
              <button className="viewerBtn" onClick={nextImg}>
                Next ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube video viewer */}
      {videoViewer && currentVideo?.youtubeId && (
        <div className="viewerOverlay" onClick={() => setVideoViewer(null)}>
          <div className="viewerModal" onClick={(e) => e.stopPropagation()}>
            <div className="viewerTop">
              <div className="viewerTitle">{currentVideo.name}</div>
              <button className="viewerClose" onClick={() => setVideoViewer(null)}>
                ×
              </button>
            </div>

            <div className="viewerVideoWrap">
              <div className="viewerVideoAspect">
                <iframe
                  className="viewerVideo"
                  src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={currentVideo.name}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>


            <div className="viewerBottom">
              <button className="viewerBtn" onClick={prevVideo}>
                ◀ Prev
              </button>
              <div className="viewerCount">
                {videoIndex + 1} / {folderVideos.length}
              </div>
              <button className="viewerBtn" onClick={nextVideo}>
                Next ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}