import React from 'react';
import { MdList as MdListElement } from '@material/web/list/list.js';
import { MdListItem as MdListItemElement } from '@material/web/list/list-item.js';
import { MdElevation as MdElevationElement } from '@material/web/elevation/elevation.js'
import { createComponent } from '@lit/react';

export const MdList = createComponent({
    tagName: 'md-list',
    elementClass: MdListElement,
    react: React,
});

export const MdListItem = createComponent({
    tagName: 'md-list-item',
    elementClass: MdListItemElement,
    react: React,
});

export const MdElevation = createComponent({
    tagName: 'md-elevation',
    elementClass: MdElevationElement,
    react: React,
});