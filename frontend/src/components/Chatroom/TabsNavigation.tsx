import React from "react";
import { Tabs, TabList, Tab, TabIndicator } from "@chakra-ui/react";

interface TabsNavigationProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs position="relative" variant="unstyled" index={activeTab} onChange={(index) => setActiveTab(index)}>
      <TabList>
        <Tab>Chat</Tab>
        <Tab>Members</Tab>
      </TabList>
      <TabIndicator mt="-1.5px" height="2px" bg="blue.500" borderRadius="1px" />
    </Tabs>
  );
};

export default TabsNavigation;
