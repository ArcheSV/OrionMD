import { visit } from 'unist-util-visit';

const spoilerRegex = /\|\|(.*?)\|\|/g;

export function remarkSpoiler() {
    return (tree: any) => {
        visit(tree, 'text', (node, index, parent) => {
            if (typeof node.value !== 'string' || !spoilerRegex.test(node.value)) {
                return;
            }

            const newNodes: any[] = [];
            let lastIndex = 0;

            node.value.replace(spoilerRegex, (match, content, offset) => {
                if (offset > lastIndex) {
                    newNodes.push({ type: 'text', value: node.value.slice(lastIndex, offset) });
                }

                newNodes.push({
                    type: 'html',
                    value: `<span class="spoiler-content">${content}</span>`
                });

                lastIndex = offset + match.length;
                return '';
            });

            if (lastIndex < node.value.length) {
                newNodes.push({ type: 'text', value: node.value.slice(lastIndex) });
            }

            parent.children.splice(index, 1, ...newNodes);

            return visit.SKIP;
        });
    };
}