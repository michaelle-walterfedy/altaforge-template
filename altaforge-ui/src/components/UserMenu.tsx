import React from "react";
import { ExitIcon } from "@radix-ui/react-icons";
import { Avatar, Popover, Text, Badge, Button, Separator, Flex } from "../themes";
import styles from "./UserMenu.module.css";

export interface UserMenuProps {
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  onLogout?: () => void;
  triggerSize?: "1" | "2" | "3";
}

const UserMenu: React.FC<UserMenuProps> = ({ name, email, role, avatarUrl, onLogout, triggerSize = "2" }) => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <button type="button" className={styles.trigger}>
          <Avatar src={avatarUrl} fallback={name[0]} size={triggerSize} radius="full" variant="soft" />
        </button>
      </Popover.Trigger>
      <Popover.Content side="bottom" align="end" sideOffset={4}>
        <Flex direction="column" className={styles.popoverContent}>
          <Text size="2" weight="bold" className={styles.userName}>
            {name}
          </Text>
          {email && (
            <Text size="1" className={styles.userEmail}>
              {email}
            </Text>
          )}
          {role && (
            <div className={styles.roleRow}>
              <Badge variant="soft" size="1">
                {role}
              </Badge>
            </div>
          )}
          <Separator size="4" />
          <Button variant="soft" color="red" size="1" className={styles.logoutButton} onClick={onLogout}>
            <ExitIcon />
            Logout
          </Button>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default UserMenu;
