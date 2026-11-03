import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ElementType } from "react";
import type { IconName } from "@/types/content";

const iconMap: Record<IconName, ElementType<SvgIconProps>> = {
  news: NewspaperOutlinedIcon,
  profiles: SchoolOutlinedIcon,
  projects: AccountTreeOutlinedIcon,
  trophy: EmojiEventsOutlinedIcon,
  computer: ComputerOutlinedIcon,
  network: HubOutlinedIcon,
  bolt: BoltOutlinedIcon,
  code: CodeOutlinedIcon,
  robot: PrecisionManufacturingOutlinedIcon,
  groups: GroupsOutlinedIcon,
  dashboard: SpaceDashboardOutlinedIcon,
  articles: ArticleOutlinedIcon,
  categories: CategoryOutlinedIcon,
  media: PermMediaOutlinedIcon,
  users: PeopleOutlinedIcon,
  menus: MenuOutlinedIcon,
  settings: SettingsOutlinedIcon,
  union: HandshakeOutlinedIcon,
};

export function AppIcon({ name, ...props }: { name: IconName } & SvgIconProps) {
  const Icon = iconMap[name];
  return <Icon {...props} />;
}
