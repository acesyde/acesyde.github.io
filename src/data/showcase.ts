export interface ShowcaseItem {
	name: string;
	href: string;
	stack: string;
	badge?: string;
	desc: string;
}

export const showcase: ShowcaseItem[] = [
	{
		name: "GNOME Iris",
		href: "https://github.com/acesyde/gnome-iris",
		stack: "Rust · GTK4 / Libadwaita",
		badge: "OSS",
		desc: "A native Linux app to install and manage ReShade shader overlays in Wine/Proton games, built with GTK4 and Libadwaita.",
	},
	{
		name: "MyLight Systems Integration",
		href: "https://github.com/acesyde/hassio_mylight_integration",
		stack: "Python · Home Assistant",
		badge: "OSS",
		desc: "A Home Assistant integration (HACS) exposing solar production, battery status, grid consumption and autonomy metrics for MyLight Systems.",
	},
	{
		name: "Agur Water Integration",
		href: "https://github.com/acesyde/hassio_agur_integration",
		stack: "Python · Home Assistant",
		badge: "OSS",
		desc: "A Home Assistant integration that retrieves water consumption and billing data from French utilities (Agur, Grand Paris Sud, Eau de Paris).",
	},
];
