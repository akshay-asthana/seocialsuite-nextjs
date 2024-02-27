"use client";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { FaGear, FaFileInvoice } from "react-icons/fa6";
import { IoCogOutline } from "react-icons/io5";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import Loading from "../app/loading";

// const Links = ["Find Ideas", "Write Script", "Get insights"];
const Links = [
  { label: "Twitter", url: "/twitter" },
  { label: "LinkedIn", url: "/linkedin" },
  { label: "Blogs", url: "/blogs" },
];

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // window.location.href = "/";
      signOut();
    }
  }
);

const NavLink = (props) => {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200"),
        // bg: useColorModeValue("gray.200", "gray.700"),
        color: "black",
      }}
      href={props.href}
    >
      {children}
    </Box>
  );
};

export default function Page() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session, status } = useSession();

  // console.log(status, session);
  // const router = useRouter();
  if (status == "loading") return <Loading />;
  if (status == "unauthenticated" && window) signIn();
  if (session) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${session.jwt}`;
  }

  const subscription = session?.user?.subscription;

  return !session ? (
    <div />
  ) : (
    <>
      <Box
        bg={"white"}
        // bg={useColorModeValue("gray.900")}
        // color="white"
        px={4}
        // color="white"
        fontWeight={"550"}
        style={{
          position: "sticky",
          top: "0",
          zIndex: "10000",
          borderBottom: "1px solid #c9c9c9",
          // boxShadow: "0px 10px 40px 0px rgba(0,0,0,0.25)",
          // opacity: "0.9",
          // background: "transparent",
          backdropFilter: "blur(30)",
        }}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <div style={{ position: "relative", width: "30px" }}>
            <div style={{ position: "absolute", top: "-10px" }}>
              <a href="/">SEOcialSage</a>
            </div>
          </div>
          <HStack
            as={"nav"}
            spacing={4}
            display={{
              base: "none",
              md: "flex",
            }}
            style={{ fontSize: "16px", fontWeight: "600" }}
          >
            {Links.map((link) => (
              <NavLink key={link.label} href={link.url}>
                {link.label}
              </NavLink>
            ))}
          </HStack>

          <Flex alignItems={"center"}>
            {/* <Button
              variant={"solid"}
              colorScheme={"teal"}
              size={"sm"}
              mr={4}
              leftIcon={<AddIcon />}
            >
              Action
            </Button> */}
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"sm"} src={session.user && session.user.image} />
              </MenuButton>
              <MenuList style={{ fontSize: "14px" }}>
                <div style={{ padding: "10px 10px", fontWeight: "600" }}>
                  {session.user.name}
                </div>
                {/* <MenuItem>Link 1</MenuItem> */}
                <a href={`/billing`}>
                  <MenuItem
                    icon={<FaFileInvoice />}
                    onClick={() => (window.location.href = "/billing")}
                  >
                    Billing & Usage
                  </MenuItem>
                </a>
                <a href={`/settings`}>
                  <MenuItem
                    icon={<IoCogOutline />}
                    onClick={() => (window.location.href = "/settings")}
                  >
                    Account Settings
                  </MenuItem>
                </a>
                <MenuDivider />
                <MenuItem
                  onClick={() => {
                    signOut();
                  }}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
