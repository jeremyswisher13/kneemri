import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h3: ({ children }) => (
    <h3 className="mt-4 mb-2 text-sm font-bold text-gray-800">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-sm text-gray-600 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-800">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 ml-5 list-disc space-y-1 text-sm text-gray-600">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 ml-5 list-decimal space-y-1 text-sm text-gray-600">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full text-sm border-collapse border border-gray-200 rounded-lg">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-ucla-light">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-ucla-dark">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-200 px-3 py-2 text-sm text-gray-600">
      {children}
    </td>
  ),
  tr: ({ children }) => (
    <tr className="even:bg-gray-50">{children}</tr>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-ucla-blue bg-ucla-light/30 pl-4 py-2 text-sm text-gray-700 italic">
      {children}
    </blockquote>
  ),
};

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
