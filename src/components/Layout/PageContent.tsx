import { Flex } from "@chakra-ui/react";
import * as React from "react";

interface IPageContentProps {
  children: any;
}

const PageContent: React.FunctionComponent<IPageContentProps> = ({
  children,
}) => {
  return (
    <Flex justify="center" p="16px 0px">
      <Flex maxWidth="800px" width="95%" justify="center">
        {/* LHS */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && (children[0] as typeof children)}
        </Flex>

        {/* RHS */}
        <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          flexGrow={1}
        >
          {children && (children[1] as typeof children)}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PageContent;
