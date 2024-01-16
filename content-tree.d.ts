export declare namespace ContentTree {
    type BodyBlock = Paragraph | Heading | ImageSet | BigNumber | Layout | List | Blockquote | Pullquote | ScrollyBlock | ThematicBreak | Table | Recommended | Tweet | Video | YoutubeVideo;
    type Phrasing = Text | Break | Strong | Emphasis | Strikethrough | Link;
    interface Node {
        type: string;
        data?: any;
    }
    interface Parent extends Node {
        children: Node[];
    }
    interface Root extends Node {
        type: "root";
        body: Body;
    }
    interface Body extends Parent {
        type: "body";
        version: number;
        children: BodyBlock[];
    }
    interface Text extends Node {
        type: "text";
        value: string;
    }
    interface Break extends Node {
        type: "break";
    }
    interface ThematicBreak extends Node {
        type: "thematic-break";
    }
    interface Paragraph extends Parent {
        type: "paragraph";
        children: Phrasing[];
    }
    interface Heading extends Parent {
        type: "heading";
        children: Text[];
        level: "chapter" | "subheading" | "label";
    }
    interface Strong extends Parent {
        type: "strong";
        children: Phrasing[];
    }
    interface Emphasis extends Parent {
        type: "emphasis";
        children: Phrasing[];
    }
    interface Strikethrough extends Parent {
        type: "strikethrough";
        children: Phrasing[];
    }
    interface Link extends Parent {
        type: "link";
        url: string;
        title: string;
        children: Phrasing[];
    }
    interface List extends Parent {
        type: "list";
        ordered: boolean;
        children: ListItem[];
    }
    interface ListItem extends Parent {
        type: "list-item";
        children: (Paragraph | Phrasing)[];
    }
    interface Blockquote extends Parent {
        type: "blockquote";
        children: (Paragraph | Phrasing)[];
    }
    interface Pullquote extends Node {
        type: "pullquote";
        text: string;
        source?: string;
    }
    interface ImageSet extends Node {
        type: "image-set";
        id: string;
        picture: ImageSetPicture;
    }
    type ImageSetPicture = {
        layoutWidth: string;
        imageType: "image" | "graphic";
        alt: string;
        caption: string;
        credit: string;
        images: Image[];
        fallbackImage: Image;
    };
    type Image = {
        id: string;
        width: number;
        height: number;
        format: "desktop" | "mobile" | "square" | "square-ftedit" | "standard" | "wide" | "standard-inline";
        url: string;
        sourceSet?: ImageSource[];
    };
    type ImageSource = {
        url: string;
        width: number;
        dpr: number;
    };
    interface Recommended extends Node {
        type: "recommended";
        id: string;
        heading?: string;
        teaserTitleOverride?: string;
        teaser: Teaser;
    }
    type TeaserConcept = {
        apiUrl: string;
        directType: string;
        id: string;
        predicate: string;
        prefLabel: string;
        type: string;
        types: string[];
        url: string;
    };
    type TeaserImage = {
        url: string;
        width: number;
        height: number;
    };
    type Indicators = {
        accessLevel: "premium" | "subscribed" | "registered" | "free";
        isOpinion?: boolean;
        isColumn?: boolean;
        isPodcast?: boolean;
        isEditorsChoice?: boolean;
        isExclusive?: boolean;
        isScoop?: boolean;
    };
    type Teaser = {
        id: string;
        url: string;
        type: "article" | "video" | "podcast" | "audio" | "package" | "liveblog" | "promoted-content" | "paid-post";
        title: string;
        publishedDate: string;
        firstPublishedDate: string;
        metaLink?: TeaserConcept;
        metaAltLink?: TeaserConcept;
        metaPrefixText?: string;
        metaSuffixText?: string;
        indicators: Indicators;
        image: Image;
    };
    interface Tweet extends Node {
        id: string;
        type: "tweet";
        html: string;
    }
    interface Flourish extends Node {
        type: "flourish";
        id: string;
        layoutWidth: string;
        flourishType: string;
        description?: string;
        timestamp?: string;
        fallbackImage?: Image;
    }
    interface BigNumber extends Node {
        type: "big-number";
        number: string;
        description: string;
    }
    interface ClipSet extends Node {
        type: "clip-set";
        id: string;
        autoplay: boolean;
        loop: boolean;
        muted: boolean;
        dataLayout: string;
        noAudio: boolean;
        caption: string;
        credits: string;
        description: string;
        displayTitle: string;
        subtitle: string;
        clips: Clip[];
    }
    type Clip = {
        id: string;
        format: string;
        dataSource: ClipSource[];
        poster: string;
    };
    type ClipSource = {
        audioCodec: string;
        binaryUrl: string;
        duration: number;
        mediaType: string;
        pixelHeight: number;
        pixelWidth: number;
        videoCodec: string;
    };
    interface Video extends Node {
        type: "video";
        id: string;
        embedded: boolean;
    }
    interface YoutubeVideo extends Node {
        type: "youtube-video";
        url: string;
    }
    interface ScrollyBlock extends Parent {
        type: "scrolly-block";
        theme: "sans" | "serif";
        children: ScrollySection[];
    }
    interface ScrollySection extends Parent {
        type: "scrolly-section";
        display: "dark-background" | "light-background";
        noBox?: true;
        position: "left" | "center" | "right";
        transition?: "delay-before" | "delay-after";
        children: [ScrollyImage, ...ScrollyCopy[]];
    }
    interface ScrollyImage extends Node {
        type: "scrolly-image";
        id: string;
        picture: ImageSetPicture;
    }
    interface ScrollyCopy extends Parent {
        type: "scrolly-copy";
        children: (ScrollyHeading | Paragraph)[];
    }
    interface ScrollyHeading extends Parent {
        type: "scrolly-heading";
        level: "chapter" | "heading" | "subheading";
        children: Text[];
    }
    interface Layout extends Parent {
        type: "layout";
        layoutName: "auto" | "card" | "timeline";
        layoutWidth: string;
        children: [Heading, LayoutImage, ...LayoutSlot[]] | [Heading, ...LayoutSlot[]] | LayoutSlot[];
    }
    interface LayoutSlot extends Parent {
        type: "layout-slot";
        children: (Heading | Paragraph | LayoutImage)[];
    }
    interface LayoutImage extends Node {
        type: "layout-image";
        id: string;
        alt: string;
        caption: string;
        credit: string;
        picture: ImageSetPicture;
    }
    type TableColumnSettings = {
        hideOnMobile: boolean;
        sortable: boolean;
        sortType: 'text' | 'number' | 'date' | 'currency' | 'percent';
    };
    interface TableCaption extends Parent {
        type: 'table-caption';
        children: Phrasing[];
    }
    interface TableCell extends Parent {
        type: 'table-cell';
        heading?: boolean;
        children: Phrasing[];
    }
    interface TableRow extends Parent {
        type: 'table-row';
        children: TableCell[];
    }
    interface TableBody extends Parent {
        type: 'table-body';
        children: TableRow[];
    }
    interface TableFooter extends Parent {
        type: 'table-footer';
        children: Phrasing[];
    }
    interface Table extends Parent {
        type: 'table';
        stripes: boolean;
        compact: boolean;
        layoutWidth: 'auto' | 'full-grid' | 'inset-left' | 'inset-right' | 'full-bleed';
        collapseAfterHowManyRows: number;
        responsiveStyle: 'overflow' | 'flat';
        children: [TableCaption, TableBody, TableFooter];
        columnSettings: TableColumnSettings[];
    }
    namespace full {
        type BodyBlock = Paragraph | Heading | ImageSet | BigNumber | Layout | List | Blockquote | Pullquote | ScrollyBlock | ThematicBreak | Table | Recommended | Tweet | Video | YoutubeVideo;
        type Phrasing = Text | Break | Strong | Emphasis | Strikethrough | Link;
        interface Node {
            type: string;
            data?: any;
        }
        interface Parent extends Node {
            children: Node[];
        }
        interface Root extends Node {
            type: "root";
            body: Body;
        }
        interface Body extends Parent {
            type: "body";
            version: number;
            children: BodyBlock[];
        }
        interface Text extends Node {
            type: "text";
            value: string;
        }
        interface Break extends Node {
            type: "break";
        }
        interface ThematicBreak extends Node {
            type: "thematic-break";
        }
        interface Paragraph extends Parent {
            type: "paragraph";
            children: Phrasing[];
        }
        interface Heading extends Parent {
            type: "heading";
            children: Text[];
            level: "chapter" | "subheading" | "label";
        }
        interface Strong extends Parent {
            type: "strong";
            children: Phrasing[];
        }
        interface Emphasis extends Parent {
            type: "emphasis";
            children: Phrasing[];
        }
        interface Strikethrough extends Parent {
            type: "strikethrough";
            children: Phrasing[];
        }
        interface Link extends Parent {
            type: "link";
            url: string;
            title: string;
            children: Phrasing[];
        }
        interface List extends Parent {
            type: "list";
            ordered: boolean;
            children: ListItem[];
        }
        interface ListItem extends Parent {
            type: "list-item";
            children: (Paragraph | Phrasing)[];
        }
        interface Blockquote extends Parent {
            type: "blockquote";
            children: (Paragraph | Phrasing)[];
        }
        interface Pullquote extends Node {
            type: "pullquote";
            text: string;
            source?: string;
        }
        interface ImageSet extends Node {
            type: "image-set";
            id: string;
            picture: ImageSetPicture;
        }
        type ImageSetPicture = {
            layoutWidth: string;
            imageType: "image" | "graphic";
            alt: string;
            caption: string;
            credit: string;
            images: Image[];
            fallbackImage: Image;
        };
        type Image = {
            id: string;
            width: number;
            height: number;
            format: "desktop" | "mobile" | "square" | "square-ftedit" | "standard" | "wide" | "standard-inline";
            url: string;
            sourceSet?: ImageSource[];
        };
        type ImageSource = {
            url: string;
            width: number;
            dpr: number;
        };
        interface Recommended extends Node {
            type: "recommended";
            id: string;
            heading?: string;
            teaserTitleOverride?: string;
            teaser: Teaser;
        }
        type TeaserConcept = {
            apiUrl: string;
            directType: string;
            id: string;
            predicate: string;
            prefLabel: string;
            type: string;
            types: string[];
            url: string;
        };
        type TeaserImage = {
            url: string;
            width: number;
            height: number;
        };
        type Indicators = {
            accessLevel: "premium" | "subscribed" | "registered" | "free";
            isOpinion?: boolean;
            isColumn?: boolean;
            isPodcast?: boolean;
            isEditorsChoice?: boolean;
            isExclusive?: boolean;
            isScoop?: boolean;
        };
        type Teaser = {
            id: string;
            url: string;
            type: "article" | "video" | "podcast" | "audio" | "package" | "liveblog" | "promoted-content" | "paid-post";
            title: string;
            publishedDate: string;
            firstPublishedDate: string;
            metaLink?: TeaserConcept;
            metaAltLink?: TeaserConcept;
            metaPrefixText?: string;
            metaSuffixText?: string;
            indicators: Indicators;
            image: Image;
        };
        interface Tweet extends Node {
            id: string;
            type: "tweet";
            html: string;
        }
        interface Flourish extends Node {
            type: "flourish";
            id: string;
            layoutWidth: string;
            flourishType: string;
            description?: string;
            timestamp?: string;
            fallbackImage?: Image;
        }
        interface BigNumber extends Node {
            type: "big-number";
            number: string;
            description: string;
        }
        interface ClipSet extends Node {
            type: "clip-set";
            id: string;
            autoplay: boolean;
            loop: boolean;
            muted: boolean;
            dataLayout: string;
            noAudio: boolean;
            caption: string;
            credits: string;
            description: string;
            displayTitle: string;
            subtitle: string;
            clips: Clip[];
        }
        type Clip = {
            id: string;
            format: string;
            dataSource: ClipSource[];
            poster: string;
        };
        type ClipSource = {
            audioCodec: string;
            binaryUrl: string;
            duration: number;
            mediaType: string;
            pixelHeight: number;
            pixelWidth: number;
            videoCodec: string;
        };
        interface Video extends Node {
            type: "video";
            id: string;
            embedded: boolean;
        }
        interface YoutubeVideo extends Node {
            type: "youtube-video";
            url: string;
        }
        interface ScrollyBlock extends Parent {
            type: "scrolly-block";
            theme: "sans" | "serif";
            children: ScrollySection[];
        }
        interface ScrollySection extends Parent {
            type: "scrolly-section";
            display: "dark-background" | "light-background";
            noBox?: true;
            position: "left" | "center" | "right";
            transition?: "delay-before" | "delay-after";
            children: [ScrollyImage, ...ScrollyCopy[]];
        }
        interface ScrollyImage extends Node {
            type: "scrolly-image";
            id: string;
            picture: ImageSetPicture;
        }
        interface ScrollyCopy extends Parent {
            type: "scrolly-copy";
            children: (ScrollyHeading | Paragraph)[];
        }
        interface ScrollyHeading extends Parent {
            type: "scrolly-heading";
            level: "chapter" | "heading" | "subheading";
            children: Text[];
        }
        interface Layout extends Parent {
            type: "layout";
            layoutName: "auto" | "card" | "timeline";
            layoutWidth: string;
            children: [Heading, LayoutImage, ...LayoutSlot[]] | [Heading, ...LayoutSlot[]] | LayoutSlot[];
        }
        interface LayoutSlot extends Parent {
            type: "layout-slot";
            children: (Heading | Paragraph | LayoutImage)[];
        }
        interface LayoutImage extends Node {
            type: "layout-image";
            id: string;
            alt: string;
            caption: string;
            credit: string;
            picture: ImageSetPicture;
        }
        type TableColumnSettings = {
            hideOnMobile: boolean;
            sortable: boolean;
            sortType: 'text' | 'number' | 'date' | 'currency' | 'percent';
        };
        interface TableCaption extends Parent {
            type: 'table-caption';
            children: Phrasing[];
        }
        interface TableCell extends Parent {
            type: 'table-cell';
            heading?: boolean;
            children: Phrasing[];
        }
        interface TableRow extends Parent {
            type: 'table-row';
            children: TableCell[];
        }
        interface TableBody extends Parent {
            type: 'table-body';
            children: TableRow[];
        }
        interface TableFooter extends Parent {
            type: 'table-footer';
            children: Phrasing[];
        }
        interface Table extends Parent {
            type: 'table';
            stripes: boolean;
            compact: boolean;
            layoutWidth: 'auto' | 'full-grid' | 'inset-left' | 'inset-right' | 'full-bleed';
            collapseAfterHowManyRows: number;
            responsiveStyle: 'overflow' | 'flat';
            children: [TableCaption, TableBody, TableFooter];
            columnSettings: TableColumnSettings[];
        }
    }
    namespace transit {
        type BodyBlock = Paragraph | Heading | ImageSet | BigNumber | Layout | List | Blockquote | Pullquote | ScrollyBlock | ThematicBreak | Table | Recommended | Tweet | Video | YoutubeVideo;
        type Phrasing = Text | Break | Strong | Emphasis | Strikethrough | Link;
        interface Node {
            type: string;
            data?: any;
        }
        interface Parent extends Node {
            children: Node[];
        }
        interface Root extends Node {
            type: "root";
            body: Body;
        }
        interface Body extends Parent {
            type: "body";
            version: number;
            children: BodyBlock[];
        }
        interface Text extends Node {
            type: "text";
            value: string;
        }
        interface Break extends Node {
            type: "break";
        }
        interface ThematicBreak extends Node {
            type: "thematic-break";
        }
        interface Paragraph extends Parent {
            type: "paragraph";
            children: Phrasing[];
        }
        interface Heading extends Parent {
            type: "heading";
            children: Text[];
            level: "chapter" | "subheading" | "label";
        }
        interface Strong extends Parent {
            type: "strong";
            children: Phrasing[];
        }
        interface Emphasis extends Parent {
            type: "emphasis";
            children: Phrasing[];
        }
        interface Strikethrough extends Parent {
            type: "strikethrough";
            children: Phrasing[];
        }
        interface Link extends Parent {
            type: "link";
            url: string;
            title: string;
            children: Phrasing[];
        }
        interface List extends Parent {
            type: "list";
            ordered: boolean;
            children: ListItem[];
        }
        interface ListItem extends Parent {
            type: "list-item";
            children: (Paragraph | Phrasing)[];
        }
        interface Blockquote extends Parent {
            type: "blockquote";
            children: (Paragraph | Phrasing)[];
        }
        interface Pullquote extends Node {
            type: "pullquote";
            text: string;
            source?: string;
        }
        interface ImageSet extends Node {
            type: "image-set";
            id: string;
        }
        type ImageSetPicture = {
            layoutWidth: string;
            imageType: "image" | "graphic";
            alt: string;
            caption: string;
            credit: string;
            images: Image[];
            fallbackImage: Image;
        };
        type Image = {
            id: string;
            width: number;
            height: number;
            format: "desktop" | "mobile" | "square" | "square-ftedit" | "standard" | "wide" | "standard-inline";
            url: string;
            sourceSet?: ImageSource[];
        };
        type ImageSource = {
            url: string;
            width: number;
            dpr: number;
        };
        interface Recommended extends Node {
            type: "recommended";
            id: string;
            heading?: string;
            teaserTitleOverride?: string;
        }
        type TeaserConcept = {
            apiUrl: string;
            directType: string;
            id: string;
            predicate: string;
            prefLabel: string;
            type: string;
            types: string[];
            url: string;
        };
        type TeaserImage = {
            url: string;
            width: number;
            height: number;
        };
        type Indicators = {
            accessLevel: "premium" | "subscribed" | "registered" | "free";
            isOpinion?: boolean;
            isColumn?: boolean;
            isPodcast?: boolean;
            isEditorsChoice?: boolean;
            isExclusive?: boolean;
            isScoop?: boolean;
        };
        type Teaser = {
            id: string;
            url: string;
            type: "article" | "video" | "podcast" | "audio" | "package" | "liveblog" | "promoted-content" | "paid-post";
            title: string;
            publishedDate: string;
            firstPublishedDate: string;
            metaLink?: TeaserConcept;
            metaAltLink?: TeaserConcept;
            metaPrefixText?: string;
            metaSuffixText?: string;
            indicators: Indicators;
            image: Image;
        };
        interface Tweet extends Node {
            id: string;
            type: "tweet";
        }
        interface Flourish extends Node {
            type: "flourish";
            id: string;
            layoutWidth: string;
            flourishType: string;
            description?: string;
            timestamp?: string;
            fallbackImage?: Image;
        }
        interface BigNumber extends Node {
            type: "big-number";
            number: string;
            description: string;
        }
        interface ClipSet extends Node {
            type: "clip-set";
            id: string;
            autoplay: boolean;
            loop: boolean;
            muted: boolean;
            dataLayout: string;
        }
        type Clip = {
            id: string;
            format: string;
            dataSource: ClipSource[];
            poster: string;
        };
        type ClipSource = {
            audioCodec: string;
            binaryUrl: string;
            duration: number;
            mediaType: string;
            pixelHeight: number;
            pixelWidth: number;
            videoCodec: string;
        };
        interface Video extends Node {
            type: "video";
            id: string;
            embedded: boolean;
        }
        interface YoutubeVideo extends Node {
            type: "youtube-video";
            url: string;
        }
        interface ScrollyBlock extends Parent {
            type: "scrolly-block";
            theme: "sans" | "serif";
            children: ScrollySection[];
        }
        interface ScrollySection extends Parent {
            type: "scrolly-section";
            display: "dark-background" | "light-background";
            noBox?: true;
            position: "left" | "center" | "right";
            transition?: "delay-before" | "delay-after";
            children: [ScrollyImage, ...ScrollyCopy[]];
        }
        interface ScrollyImage extends Node {
            type: "scrolly-image";
            id: string;
        }
        interface ScrollyCopy extends Parent {
            type: "scrolly-copy";
            children: (ScrollyHeading | Paragraph)[];
        }
        interface ScrollyHeading extends Parent {
            type: "scrolly-heading";
            level: "chapter" | "heading" | "subheading";
            children: Text[];
        }
        interface Layout extends Parent {
            type: "layout";
            layoutName: "auto" | "card" | "timeline";
            layoutWidth: string;
            children: [Heading, LayoutImage, ...LayoutSlot[]] | [Heading, ...LayoutSlot[]] | LayoutSlot[];
        }
        interface LayoutSlot extends Parent {
            type: "layout-slot";
            children: (Heading | Paragraph | LayoutImage)[];
        }
        interface LayoutImage extends Node {
            type: "layout-image";
            id: string;
            alt: string;
            caption: string;
            credit: string;
        }
        type TableColumnSettings = {
            hideOnMobile: boolean;
            sortable: boolean;
            sortType: 'text' | 'number' | 'date' | 'currency' | 'percent';
        };
        interface TableCaption extends Parent {
            type: 'table-caption';
            children: Phrasing[];
        }
        interface TableCell extends Parent {
            type: 'table-cell';
            heading?: boolean;
            children: Phrasing[];
        }
        interface TableRow extends Parent {
            type: 'table-row';
            children: TableCell[];
        }
        interface TableBody extends Parent {
            type: 'table-body';
            children: TableRow[];
        }
        interface TableFooter extends Parent {
            type: 'table-footer';
            children: Phrasing[];
        }
        interface Table extends Parent {
            type: 'table';
            stripes: boolean;
            compact: boolean;
            layoutWidth: 'auto' | 'full-grid' | 'inset-left' | 'inset-right' | 'full-bleed';
            collapseAfterHowManyRows: number;
            responsiveStyle: 'overflow' | 'flat';
            children: [TableCaption, TableBody, TableFooter];
            columnSettings: TableColumnSettings[];
        }
    }
}
