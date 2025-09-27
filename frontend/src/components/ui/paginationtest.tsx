import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function PaginationTest() {
  return (
    <Pagination className="p-5 border-2 border-gray-300">
      <PaginationContent>
        <PaginationItem >
          <PaginationPrevious href="#" size={100} className="text-blue-500 mr-3"/>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/tests" isActive size={undefined} className="bg-blue-400 text-white ">
            1
            </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/tests/index/2"  size={undefined}>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="tests/index/3" size={undefined}>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" size={100} className="text-blue-500 ml-2"/>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
