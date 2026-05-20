import type { Meta, StoryObj } from "@storybook/react";
import UserMenu from "./UserMenu";

const meta = {
  title: "Components/UserMenu",
  component: UserMenu,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text", description: "User display name" },
    email: { control: "text", description: "User email address" },
    role: { control: "text", description: "User role shown as a badge" },
    avatarUrl: { control: "text", description: "Optional avatar image URL" },
    onLogout: { action: "onLogout", description: "Called when logout is clicked" },
    triggerSize: {
      control: "select",
      options: ["1", "2", "3"],
      description: "Avatar trigger size",
    },
  },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// -- Default ------------------------------------------------------------------

export const Default: Story = {
  args: {
    name: "Mark Ly",
    email: "mark.ly@altaml.com",
    role: "Developer",
  },
};

// -- MinimalInfo --------------------------------------------------------------

export const MinimalInfo: Story = {
  args: {
    name: "Jane",
  },
};

// -- WithAvatar ---------------------------------------------------------------

export const WithAvatar: Story = {
  args: {
    name: "Alex Chen",
    email: "alex.chen@altaml.com",
    role: "Engineer",
    triggerSize: "3",
  },
};

// -- AdminRole ----------------------------------------------------------------

export const AdminRole: Story = {
  args: {
    name: "Admin User",
    email: "admin@altaml.com",
    role: "Admin",
  },
};
