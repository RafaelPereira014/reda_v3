"use strict";

import React from "react";

// Components
import ImagesLightbox from "#/components/common/imagesLightbox";
import ConfirmBox from "#/components/common/externalConnection";
import SvgComponent from "#/components/common/svg";

// Utils
import { setUrl } from "#/utils";

//
//	Print media ckontent
//
class TypeHelper {
  constructor() {
    this.showPlaceholder = this.showPlaceholder.bind(this);
    this.checkExtension = this.checkExtension.bind(this);
    this.includeSwf = this.includeSwf.bind(this);
    this.includeAudio = this.includeAudio.bind(this);

    this.printSwfOrVideo = this.printSwfOrVideo.bind(this);
    this.printImage = this.printImage.bind(this);
    this.printAudio = this.printAudio.bind(this);

    // Allowed extentions to embed
    this.possibleExt = ["swf", "mp3", "wav", "wma", "jar"];
  }

  //
  //	Generic placeholder
  //
  showPlaceholder(meta, graphicsPath, type, link) {
    if (link && (!meta.embed || meta.embed.length == 0) && !meta.thumb) {
      return (
        <ConfirmBox
          target={setUrl(link)}
          type="Resource Link"
          className="resource__preview--link"
          title="Abrir Recurso"
        >
          {/*<img src={graphicsPath + "/" + type + ".jpg"} className="img-responsive" alt={type}/>*/}
          <div className="svg-wrapper">
            <SvgComponent
              element={`${meta.files}/terms/${meta.format.slug}/${meta.format.Image.name}.${meta.format.Image.extension}`}
              color={meta.format.color ? meta.format.color : "#6a696a"}
            />
          </div>
        </ConfirmBox>
      );
    }

    if (
      meta.embed != undefined &&
      meta.embed != null &&
      meta.embed &&
      meta.embed.length > 0
    ) {
      return (
        (
          <div
            dangerouslySetInnerHTML={{ __html: meta.embed }}
            className="embed-content"
          />
        ) || this.showPlaceholder(meta, meta.graphicsPath, type)
      );
    }

    if (meta.thumb) {
      const { name, extension } = meta.thumb;

      const images = [meta.filesPath + "/" + name + "." + extension];

      return <ImagesLightbox images={images} />;
    }

    return (
      <div className="resource__preview--generic">
        {/*<img src={graphicsPath + "/" + type + ".jpg"} className="img-responsive" alt={type}/>*/}
        <div className="svg-wrapper">
          {meta.format.Image.name && meta.format.Image.extension && (
            <SvgComponent
              element={`${meta.files}/terms/${meta.format.slug}/${meta.format.Image.name}.${meta.format.Image.extension}`}
              color={meta.format.color ? meta.format.color : "#6a696a"}
            />
          )}
        </div>
      </div>
    );
  }

  //
  //	Check if extension is OK
  //
  checkExtension(ext) {
    return this.possibleExt.indexOf(ext) >= 0;
  }

  //
  //	Return swf embed
  //
  includeSwf(filePath, fileName) {
    return (
      <embed
        src={filePath + "/" + fileName}
        quality="high"
        type="application/x-shockwave-flash"
        width="100%"
        height="300px"
        SCALE="exactfit"
        pluginspage="http://www.macromedia.com/go/getflashplayer"
      ></embed>
    );
  }

  //
  //	Return audio embed
  //
  includeAudio(filePath, fileName, type) {
    return (
      <audio controls preload="auto">
        <source src={filePath + "/" + fileName} type={"audio/" + type} />
        <p>
          O seu navegador não suporta o elemento <code>audio</code>.
        </p>
      </audio>
    );
  }

  //
  //	Print SWF embed
  //
  printSwfOrVideo(meta, type) {
    const { embed } = meta;

    if (meta.file != undefined && meta.file != null) {
      const { name, extension } = meta.file;

      if (this.checkExtension(meta.file.extension) && name && extension) {
        return this.includeSwf(meta.filesPath, name + "." + extension);
      }
    }

    if (embed != undefined && embed != null && embed && embed.length > 0) {
      return (
        (
          <div
            dangerouslySetInnerHTML={{ __html: embed }}
            className="embed-content"
          />
        ) || this.showPlaceholder(meta, meta.graphicsPath, type)
      );
    }

    return this.showPlaceholder(meta, meta.graphicsPath, type, meta.link);
  }

  //
  //	Print audio embed HTML5
  //
  printAudio(meta, type) {
    const { embed } = meta;

    if (meta.file != undefined && meta.file != null) {
      const { name, extension } = meta.file;

      if (this.checkExtension(meta.file.extension) && name && extension) {
        return this.includeAudio(
          meta.filesPath,
          name + "." + extension,
          extension
        );
      }
    }

    if (embed != undefined && embed != null && embed && embed.length > 0) {
      return (
        (
          <div
            dangerouslySetInnerHTML={{ __html: embed }}
            className="embed-content"
          />
        ) || this.showPlaceholder(meta, meta.graphicsPath, type)
      );
    }

    return this.showPlaceholder(meta, meta.graphicsPath, type, meta.link);
  }

  //
  //	Print as image
  //
  printImage(meta, type) {
    const allowedExt = ["gif", "jpeg", "jpg", "png", "svg", "JPG"];

    if (meta.thumb && allowedExt.indexOf(meta.thumb.extension) >= 0) {
      console.log(meta);
      const { name, extension } = meta.thumb;

      const images = [meta.filesPath + "/" + name + "." + extension];

      return <ImagesLightbox images={images} />;
    }

    return this.showPlaceholder(meta, meta.graphicsPath, type, meta.link);
  }
}

//
//	Return the embed object according to content type
//
class PrintMedia extends TypeHelper {
  constructor(meta, type) {
    super();

    (this.meta = meta), (this.type = type);

    this.printContent = this.printContent.bind(this);
  }

  printContent() {
    console.log(this.type);
    switch (this.type) {
      case "video":
        return this.printSwfOrVideo(this.meta, this.type);

      case "image-2":
        return this.printSwfOrVideo(this.meta, this.type);

      case "audio-3":
        return this.printAudio(this.meta, this.type);

      case "simulation":
        return this.printSwfOrVideo(this.meta, this.type);

      case "animation":
        return this.printSwfOrVideo(this.meta, this.type);

      case "game":
        return this.printSwfOrVideo(this.meta, this.type);

      case "text":
        return this.printSwfOrVideo(this.meta, this.type);

      case "calc":
        return this.printSwfOrVideo(this.meta, this.type);
      case "questionario":
        return this.printSwfOrVideo(this.meta, this.type);
      case "licao":
        return this.printSwfOrVideo(this.meta, this.type);
      case "tutorial":
        return this.printSwfOrVideo(this.meta, this.type);
      case "realidadadevirtual":
        return this.printSwfOrVideo(this.meta, this.type);
      case "others":
        return this.printSwfOrVideo(this.meta, this.type);

      default:
        return this.printSwfOrVideo(this.meta, this.type);
    }
  }
}

export default (props) => {
  const { type } = props;

  if (!props.type) {
    return <div></div>;
  }

  let mediaObj = new PrintMedia(props, type);

  return (
    <div className="mediadisplay-container">
      {type ? mediaObj.printContent() : ""}
    </div>
  );
};
