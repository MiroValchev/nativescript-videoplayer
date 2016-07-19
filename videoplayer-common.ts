﻿import dependencyObservable = require("ui/core/dependency-observable");
import view = require("ui/core/view");
import proxy = require("ui/core/proxy");
import videoSource = require("./video-source/video-source");
import definition = require("videoplayer");
import enums = require("ui/enums");
import platform = require("platform");
import utils = require("utils/utils");
import * as types from "utils/types";


var SRC = "src";
var VIDEO_SOURCE = "videoSource";
var VIDEO = "Video";
var ISLOADING = "isLoading";
var AUTOPLAY = "autoplay";
var CONTROLS = "controls";
var LOOP = "loop";

var ON_OPEN = "opening";
var ON_ERROR = "error";
var ON_FINISH = "finished";

// on Android we explicitly set propertySettings to None because android will invalidate its layout (skip unnecessary native call).
var AffectsLayout = platform.device.os === platform.platformNames.android ? dependencyObservable.PropertyMetadataSettings.None : dependencyObservable.PropertyMetadataSettings.AffectsLayout;

function onSrcPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var video = <Video>data.object;
    var value = data.newValue;

    if (types.isString(value)) {
        value = value.trim();
        video.videoSource = null;
        video["_url"] = value;

        video._setValue(Video.isLoadingProperty, true);

        if (utils.isFileOrResourcePath(value)) {
            video.videoSource = videoSource.fromFileOrResource(value);
            video._setValue(Video.isLoadingProperty, false);
        } else {
            if (video["_url"] === value) {
                video.videoSource = videoSource.fromUrl(value);
                video._setValue(Video.isLoadingProperty, false);
            }
        }
    } else if (value instanceof videoSource.VideoSource) {
        video.videoSource = value;
    } else {
        video.videoSource = videoSource.fromNativeSource(value);
    }
}


export class Video extends view.View implements definition.Video {
    public static finishedEvent = ON_FINISH;
    public static openingEvent = ON_OPEN;
    public static errorEvent = ON_ERROR;    

    public static srcProperty = new dependencyObservable.Property(
        SRC,
        VIDEO,
        new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, onSrcPropertyChanged)
    );

    public static videoSourceProperty = new dependencyObservable.Property(
        VIDEO_SOURCE,
        VIDEO,
        new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None)
    );

    public static isLoadingProperty = new dependencyObservable.Property(
        ISLOADING,
        VIDEO,
        new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.None)
    );

    public static autoplayProperty = new dependencyObservable.Property(
        AUTOPLAY,
        VIDEO,
        new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.None)
    );

    public static controlsProperty = new dependencyObservable.Property(
        CONTROLS,
        VIDEO,
        new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.None)
    );

    public static loopProperty = new dependencyObservable.Property(
        LOOP,
        VIDEO,
        new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.None)
    );

    constructor(options?: definition.Options) {
        super(options);
    }

    get videoSource(): videoSource.VideoSource {
        return this._getValue(Video.videoSourceProperty);
    }
    set videoSource(value: videoSource.VideoSource) {
        this._setValue(Video.videoSourceProperty, value);
    }

    get src(): any {
        return this._getValue(Video.srcProperty);
    }
    set src(value: any) {
        this._setValue(Video.srcProperty, value);
    }

    get isLoading(): boolean {
        return this._getValue(Video.isLoadingProperty);
    }

    get autoplay(): any {
        return this._getValue(Video.autoplayProperty);
    }
    set autoplay(value: any) {
        this._setValue(Video.autoplayProperty, value);
    }

    get controls(): any {
        return this._getValue(Video.controlsProperty);
    }
    set controls(value: any) {
        this._setValue(Video.controlsProperty, value);
    }

    get loop(): any {
        return this._getValue(Video.loopProperty);
    }
    set loop(value: any) {
        this._setValue(Video.loopProperty, value);
    }

    public _setNativeVideo(nativeVideo: any) {
        //
    }

    public finishedCallback() { } //TODO

}